module attendance_addr::Attendance {
    use std::vector;
    use std::string::{String};
    use aptos_framework::account;
    use aptos_framework::event;

    // Error codes for clear debugging
    const E_ATTENDANCE_STORE_NOT_FOUND: u64 = 1;
    const E_ATTENDANCE_STORE_ALREADY_EXISTS: u64 = 2;
    const E_NOT_A_TEACHER: u64 = 3;

    /// A single attendance record for a student on a specific date.
    /// This struct does not have the `key` ability as it is stored within AttendanceStore.
    /// It needs `store` to be part of a struct and `drop` to be removed from memory.
    struct AttendanceRecord has store, drop {
        date: String,
        present: bool,
    }

    /// The main resource struct that holds all attendance records for a single student account.
    /// It has the `key` ability, allowing it to be stored directly under an account.
    struct AttendanceStore has key {
        records: vector<AttendanceRecord>,
    }

    /// A capability resource that marks an account as a teacher.
    /// This provides a simple and secure way to manage permissions.
    struct TeacherCapability has key {}

    /// Event emitted when attendance is marked or updated.
    /// Off-chain indexers can listen to these events to build a history.
    struct AttendanceMarkedEvent has drop, store {
        student: address,
        date: String,
        present: bool,
    }

    /// This function should be called by the module owner during deployment or a subsequent
    /// transaction to grant teacher permissions to a specific account.
    public(friend) fun grant_teacher_capability(teacher_account: &signer) {
        move_to(teacher_account, TeacherCapability {});
    }

    /// Initializes the attendance tracking resource for a student account.
    /// This must be called by the student before their attendance can be marked.
    public entry fun initialize(account: &signer) {
        assert!(!exists<AttendanceStore>(account::address_of(account)), E_ATTENDANCE_STORE_ALREADY_EXISTS);
        move_to(account, AttendanceStore { records: vector::empty() });
    }

    /// Allows a designated teacher to mark or update a student's attendance for a given date.
    public entry fun mark_attendance(teacher: &signer, student: address, date: String, present: bool) {
        // Ensure the caller has the TeacherCapability resource, restricting this function to teachers.
        assert!(exists<TeacherCapability>(account::address_of(teacher)), E_NOT_A_TEACHER);

        let store = borrow_global_mut<AttendanceStore>(student);

        // Note: This is an O(n) search. For a large number of records,
        // this could become expensive. A `Table` would be more efficient.
        let i = 0;
        while (i < vector::length(&store.records)) {
            let record = vector::borrow_mut(&mut store.records, i);
            if (record.date == date) {
                record.present = present;
                event::emit(AttendanceMarkedEvent { student, date, present });
                return;
            };
            i = i + 1;
        };

        // If no record for the date exists, create a new one.
        vector::push_back(&mut store.records, AttendanceRecord { date, present });
        event::emit(AttendanceMarkedEvent { student, date, present });
    }

    /// A read-only "view" function to retrieve all attendance records for a student.
    /// It returns two parallel vectors (dates and statuses) because Move view functions
    /// cannot return vectors of structs that don't have the `copy` ability.
    #[view]
    public fun get_attendance_records(student: address): (vector<String>, vector<bool>) {
        assert!(exists<AttendanceStore>(student), E_ATTENDANCE_STORE_NOT_FOUND);
        let store = borrow_global<AttendanceStore>(student);
        let dates = vector::empty<String>();
        let presences = vector::empty<bool>();
        let i = 0;
        while (i < vector::length(&store.records)) {
            let record = vector::borrow(&store.records, i);
            vector::push_back(&mut dates, record.date);
            vector::push_back(&mut presences, record.present);
            i = i + 1;
        };
        (dates, presences)
    }
}
