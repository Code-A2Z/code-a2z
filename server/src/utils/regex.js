export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const emailRegex = /^\w{3,}([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const URLRegex =
  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.,@?^=%&:/~+#]*)?$/;
