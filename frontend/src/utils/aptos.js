import { AptosClient, AptosAccount, HexString } from "aptos";

const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

// Replace with your actual private key (keep this secret, for testing only)
const TEACHER_PRIVATE_KEY = "0xYOUR_TEACHER_PRIVATE_KEY";
const teacherAccount = new AptosAccount(HexString.ensure(TEACHER_PRIVATE_KEY).toUint8Array());

// Replace with your deployed contract's account address
const MODULE_ADDRESS = "0xyourteacheraddress";

function buildPayload(functionName, args = []) {
  return {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::Attendance::${functionName}`,
    type_arguments: [],
    arguments: args,
  };
}

export async function markAttendance(studentAddress, date, present) {
  const payload = buildPayload("mark_attendance", [studentAddress, date, present]);
  const txnRequest = await client.generateTransaction(teacherAccount.address(), payload);
  const signedTxn = await client.signTransaction(teacherAccount, txnRequest);
  const res = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(res.hash);
  return res;
}
