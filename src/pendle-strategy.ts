import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  ClaimedRewards as ClaimedRewardsEvent,
} from "../generated/PendleStrategy/PendleStrategy";
import { User, Transaction, TransactionSummary } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

// ID for the general transaction summary, doesn't change
const tSGId = new BigInt(1).toHexString();

function handleUser(userId: string): User {
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.save();
  }
  return user as User;
}

function handleTransactionSummary(
  txHash: string,
  tSG: TransactionSummary,
  timestamp: BigInt,
  blockNumber: BigInt
): void {
  // transactionSummary (tS)
  let tS = new TransactionSummary(txHash);
  tS.depositGasUsed = tSG.depositGasUsed;
  tS.depositTxCost = tSG.depositTxCost;
  tS.withdrawalGasUsed = tSG.withdrawalGasUsed;
  tS.withdrawalTxCost = tSG.withdrawalTxCost;
  tS.claimedRewardsGasUsed = tSG.claimedRewardsGasUsed;
  tS.claimedRewardsTxCost = tSG.claimedRewardsTxCost;
  tS.blockTimestamp = timestamp;
  tS.blockNumber = blockNumber;
  tS.save();
}

export function handleDeposit(event: DepositEvent): void {
  const user = handleUser(event.params.user.toHexString());

  let gasUsed: BigInt = new BigInt(0);
  if (event.receipt) gasUsed = event.receipt!.gasUsed;

  const transactionCost = gasUsed.times(event.transaction.gasPrice);
  const timestamp = event.block.timestamp;
  const number = event.block.number;
  const txHash = event.transaction.hash.toHexString();

  let transaction = new Transaction(txHash);
  if (transaction) {
    transaction.user = user.id;
    transaction.gasUsed = gasUsed;
    transaction.gasLimit = event.transaction.gasLimit;
    transaction.txCost = transactionCost;
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.blockTimestamp = timestamp;
    transaction.blockNumber = number;
    transaction.transactionType = "Deposit";
    transaction.save();
  }

  // transactionSummaryGeneral (tSG)
  let tSG = TransactionSummary.load(tSGId);
  if (!tSG) {
    tSG = new TransactionSummary(tSGId);
    tSG.depositGasUsed = gasUsed;
    tSG.depositTxCost = transactionCost;
    tSG.withdrawalGasUsed = new BigInt(0);
    tSG.withdrawalTxCost = new BigInt(0);
    tSG.claimedRewardsGasUsed = new BigInt(0);
    tSG.claimedRewardsTxCost = new BigInt(0);
    tSG.blockTimestamp = new BigInt(0);
    tSG.blockNumber = new BigInt(0);
  } else {
    tSG.depositGasUsed = tSG.depositGasUsed.plus(gasUsed);
    tSG.depositTxCost = tSG.depositTxCost.plus(transactionCost);
  }
  tSG.save();

  handleTransactionSummary(txHash, tSG, timestamp, number);
}

export function handleWithdraw(event: WithdrawEvent): void {
  const user = handleUser(event.params.user.toHexString());

  let gasUsed: BigInt = new BigInt(0);
  if (event.receipt) gasUsed = event.receipt!.gasUsed;

  const transactionCost = gasUsed.times(event.transaction.gasPrice);
  const timestamp = event.block.timestamp;
  const number = event.block.number;
  const txHash = event.transaction.hash.toHexString();

  let transaction = new Transaction(txHash);
  if (transaction) {
    transaction.user = user.id;
    transaction.gasUsed = gasUsed;
    transaction.gasLimit = event.transaction.gasLimit;
    transaction.txCost = transactionCost;
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.blockTimestamp = timestamp;
    transaction.blockNumber = number;
    transaction.transactionType = "Withdrawal";
    transaction.save();
  }

  // transactionSummaryGeneral (tSG)
  let tSG = TransactionSummary.load(tSGId);
  if (!tSG) {
    tSG = new TransactionSummary(tSGId);
    tSG.depositGasUsed = new BigInt(0);
    tSG.depositTxCost = new BigInt(0);
    tSG.withdrawalGasUsed = gasUsed;
    tSG.withdrawalTxCost = transactionCost;
    tSG.claimedRewardsGasUsed = new BigInt(0);
    tSG.claimedRewardsTxCost = new BigInt(0);
    tSG.blockTimestamp = new BigInt(0);
    tSG.blockNumber = new BigInt(0);
  } else {
    tSG.withdrawalGasUsed = tSG.withdrawalGasUsed.plus(gasUsed);
    tSG.withdrawalTxCost = tSG.withdrawalTxCost.plus(transactionCost);
  }
  tSG.save();

  handleTransactionSummary(txHash, tSG, timestamp, number);
}

export function handleClaimedRewards(event: ClaimedRewardsEvent): void {
  const user = handleUser(event.params.user.toHexString());

  let gasUsed: BigInt = new BigInt(0);
  if (event.receipt) gasUsed = event.receipt!.gasUsed;

  const transactionCost = gasUsed.times(event.transaction.gasPrice);
  const timestamp = event.block.timestamp;
  const number = event.block.number;
  const txHash = event.transaction.hash.toHexString();

  let transaction = new Transaction(txHash);
  if (transaction) {
    transaction.user = user.id;
    transaction.gasUsed = gasUsed;
    transaction.gasLimit = event.transaction.gasLimit;
    transaction.txCost = transactionCost;
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.blockTimestamp = timestamp;
    transaction.blockNumber = number;
    transaction.transactionType = "ClaimRewards";
    transaction.save();
  }

  // transactionSummaryGeneral (tSG)
  let tSG = TransactionSummary.load(tSGId);
  if (!tSG) {
    tSG = new TransactionSummary(tSGId);
    tSG.depositGasUsed = new BigInt(0);
    tSG.depositTxCost = new BigInt(0);
    tSG.withdrawalGasUsed = new BigInt(0);
    tSG.withdrawalTxCost = new BigInt(0);
    tSG.claimedRewardsGasUsed = gasUsed;
    tSG.claimedRewardsTxCost = transactionCost;
    tSG.blockTimestamp = new BigInt(0);
    tSG.blockNumber = new BigInt(0);
  } else {
    tSG.claimedRewardsGasUsed = tSG.claimedRewardsGasUsed.plus(gasUsed);
    tSG.claimedRewardsTxCost = tSG.claimedRewardsTxCost.plus(transactionCost);
  }
  tSG.save();

  handleTransactionSummary(txHash, tSG, timestamp, number);
}
