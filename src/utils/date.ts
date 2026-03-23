import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration.js";
import utcPlugin from "dayjs/plugin/utc.js";

dayjs.extend(durationPlugin);
dayjs.extend(utcPlugin);

const serverShanghaiFormat = "YYYY-MM-DD HH:mm:ss";
const serverShanghaiStandFormat = "YYYY-MM-DD HH:mm:ss+08:00";
const serverShanghaiFormatWithT = "YYYY-MM-DDTHH:mm:ss";
const serverShanghaiStandFormatWithT = "YYYY-MM-DDTHH:mm:ss+08:00";

const isServerShanghaiDate = (date: dayjs.ConfigType) => {
  if (typeof date !== "string") return false;
  if (date.length !== serverShanghaiFormat.length) return false;
  return dayjs(date, serverShanghaiFormat).isValid();
};

const isServerShanghaiStandDate = (date: dayjs.ConfigType) => {
  if (typeof date !== "string") return false;
  if (date.length !== serverShanghaiStandFormat.length) return false;
  return dayjs(date, serverShanghaiStandFormat).isValid();
};

const isServerShanghaiDateWithT = (date: dayjs.ConfigType) => {
  if (typeof date !== "string") return false;
  if (date.length !== serverShanghaiFormatWithT.length) return false;
  return dayjs(date, serverShanghaiFormatWithT).isValid();
};

const isServerShanghaiStandDateWithT = (date: dayjs.ConfigType) => {
  if (typeof date !== "string") return false;
  if (date.length !== serverShanghaiStandFormatWithT.length) return false;
  return dayjs(date, serverShanghaiStandFormatWithT).isValid();
};

const parseServerShanghaiDate = (date: dayjs.ConfigType) => {
  return dayjs(`${date}+08:00`, serverShanghaiStandFormat);
};
const parseServerShanghaiStandDate = (date: dayjs.ConfigType) => {
  return dayjs(date, serverShanghaiStandFormat);
};

const parseServerShanghaiDateWithT = (date: dayjs.ConfigType) => {
  return dayjs(`${date}+08:00`, serverShanghaiStandFormatWithT);
};
const parseServerShanghaiStandDateWithT = (date: dayjs.ConfigType) => {
  return dayjs(date, serverShanghaiStandFormatWithT);
};

export const parseDate = (date?: dayjs.ConfigType) => {
  if (!date) return dayjs();

  if (isServerShanghaiDate(date)) {
    return parseServerShanghaiDate(date);
  }

  if (isServerShanghaiStandDate(date)) {
    return parseServerShanghaiStandDate(date);
  }

  if (isServerShanghaiDateWithT(date)) {
    return parseServerShanghaiDateWithT(date);
  }

  if (isServerShanghaiStandDateWithT(date)) {
    return parseServerShanghaiStandDateWithT(date);
  }

  return dayjs(date);
};
