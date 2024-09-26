// 密碼生成器 JavaScript 代碼

function checkInput() {
  const key = document.getElementById('keyInput').value;
  const yearStr = document.getElementById('yearInput').value;
  const monthStr = document.getElementById('monthInput').value;
  const lengthOption = parseInt(document.getElementById('lengthSelect').value);

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
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
}

function generatePassword(key, year, month, length) {
  const dateStr = `${year}${month.toString().padStart(2, '0')}`;
  const inputStr = `${key}${dateStr}`;
  
  // 使用簡單的偽隨機數生成器
  let seed = Array.from(inputStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
  };

  const allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(),.?\":{}|<>";
  let password = '';
  for (let i = 0; i < length; i++) {
      password += allChars[Math.floor(random() * allChars.length)];
  }
  return password;
}

function passwordOutput() {
  const data = checkInput();
  if (data === null) return;

  const { key, year, month, lengthOption } = data;
  let password = generatePassword(key, year, month, lengthOption);
  while (!checkPassword(password)) {
      password = generatePassword(password, year, month, lengthOption);
  }

  document.getElementById('resultLabel').textContent = `您的密碼是: ${password}`;
  document.getElementById('passwordInput').value = password;
}

function showError(message) {
  alert(message);
}

function copyPassword() {
  const passwordInput = document.getElementById('passwordInput');
  passwordInput.select();
  document.execCommand('copy');
}

// 設置事件監聽器
document.getElementById('generateButton').addEventListener('click', passwordOutput);
document.getElementById('copyButton').addEventListener('click', copyPassword);

// 為長度選擇添加自定義輸入功能
document.getElementById('lengthSelect').addEventListener('change', function(e) {
  if (e.target.value === 'custom') {
      const customLength = prompt('請輸入自定義長度（最少9字元）：');
      if (customLength !== null) {
          const length = parseInt(customLength);
          if (!isNaN(length) && length >= 9) {
              e.target.value = length;
          } else {
              alert('無效的長度。使用預設值10。');
              e.target.value = '10';
          }
      } else {
          e.target.value = '10';
      }
  }
});