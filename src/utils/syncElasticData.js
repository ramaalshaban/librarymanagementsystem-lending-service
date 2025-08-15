const { getLoanById, getIdListOfLoanByField } = require("dbLayer");
const {
  getReservationById,
  getIdListOfReservationByField,
} = require("dbLayer");
const { getLoanEventById, getIdListOfLoanEventByField } = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexLoanData = async () => {
  const loanIndexer = new ElasticIndexer("loan", { isSilent: true });
  console.log("Starting to update indexes for Loan");

  const idList = (await getIdListOfLoanByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getLoanById(chunk);
    if (dataList.length) {
      await loanIndexer.indexBulkData(dataList);
      await loanIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexReservationData = async () => {
  const reservationIndexer = new ElasticIndexer("reservation", {
    isSilent: true,
  });
  console.log("Starting to update indexes for Reservation");

  const idList = (await getIdListOfReservationByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getReservationById(chunk);
    if (dataList.length) {
      await reservationIndexer.indexBulkData(dataList);
      await reservationIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexLoanEventData = async () => {
  const loanEventIndexer = new ElasticIndexer("loanEvent", { isSilent: true });
  console.log("Starting to update indexes for LoanEvent");

  const idList = (await getIdListOfLoanEventByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getLoanEventById(chunk);
    if (dataList.length) {
      await loanEventIndexer.indexBulkData(dataList);
      await loanEventIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexLoanData();
    console.log("Loan agregated data is indexed, total loans:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Loan data", err.toString());
  }

  try {
    const dataCount = await indexReservationData();
    console.log(
      "Reservation agregated data is indexed, total reservations:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing Reservation data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexLoanEventData();
    console.log(
      "LoanEvent agregated data is indexed, total loanEvents:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing LoanEvent data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
