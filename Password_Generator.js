function checkInput() {
  const key = keyInput.value;
  const yearStr = yearInput.value;
  const monthStr = monthInput.value;
  const lengthOption = parseInt(lengthSelect.value);

  if (!key) {
    showError("請輸入金鑰！");
    return null;
  }
  if (!yearStr) {
    showError("請輸入年份！");
    return null;
  }
  if (!monthStr) {
    showError("請輸入月份！");
    return null;
  }
  if (lengthOption < 9) {
    showError("密碼長度不足 9 個字元！");
    return null;
  }

  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  if (isNaN(year) || isNaN(month)) {
    showError("年份和月份必須是數字！");
    return null;
  }

  return { key, year, month, lengthOption };
}

function checkPassword(password) {
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return false;
  return true;
}

function generatePassword(key, year, month, length) {
  const dateStr = `${year}${month.toString().padStart(2, '0')}`;
  const inputStr = `${key}${dateStr}`;
  const seed = hashCode(inputStr); // 使用 hashCode 作为种子

  let password = '';
  const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(),.?\":{}|<>';
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return password;
}

function passwordOutput() {
  const data = checkInput();
  if (!data) return;

  const { key, year, month, lengthOption } = data;
  let password = generatePassword(key, year, month, lengthOption);
  while (!checkPassword(password)) {
    password = generatePassword(password, year, month, lengthOption);
  }

  resultLabel.textContent = `您的密碼是: ${password}`;
  passwordInput.value = password;
  navigator.clipboard.writeText(password);
}

function showError(message) {
  alert(message);
}

// 使用簡單的 hashCode 算法
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// HTML 元素
const keyInput = document.getElementById('keyInput');
const yearInput = document.getElementById('yearInput');
const monthInput = document.getElementById('monthInput');
const lengthSelect = document.getElementById('lengthSelect');
const generateButton = document.getElementById('generateButton');
const resultLabel = document.getElementById('resultLabel');
const passwordInput = document.getElementById('passwordInput');

generateButton.addEventListener('click', passwordOutput);