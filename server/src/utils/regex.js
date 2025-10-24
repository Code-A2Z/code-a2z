export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const EMAIL_REGEX = /^\w{3,}([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const URL_REGEX =
  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.,@?^=%&:/~+#]*)?$/;
