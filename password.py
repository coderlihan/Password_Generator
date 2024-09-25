import hashlib
import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import pyperclip
import random
import re

def check_input():
    """檢查輸入的有效性，並返回金鑰、年份、月份和長度。"""
    key = key_entry.get()
    year_str = year_entry.get()
    month_str = month_entry.get()
    length_option = int(length_var.get())

    if not key:
        show_error("請輸入金鑰！")
        return None
    if not year_str:
        show_error("請輸入年份！")
        return None
    if not month_str:
        show_error("請輸入月份！")
        return None
    if length_option < 9:
        show_error("密碼長度不足 9 個字元！")
        return None

    try:
        year = int(year_str)
        month = int(month_str)
    except ValueError:
        show_error("年份和月份必須是數字！")
        return None

    return key, year, month, length_option

def check_password(password):
    """檢查密碼是否符合要求。"""
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def generate_password(key, year, month, length):
    """生成密碼並返回。"""
    date_str = f"{year}{month:02}"
    input_str = f"{key}{date_str}"
    random.seed(input_str)

    password = []
    all_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(),.?\":{}|<>"
    for _ in range(length):
        password.append(random.choice(all_chars))
    return ''.join(password)

def password_output():
    """生成密碼，顯示在結果欄位中，並自動複製到剪貼簿。"""
    data = check_input()
    if data is None:
        return

    key, year, month, length = data
    password = generate_password(key, year, month, length)
    while not check_password(password):
        password = generate_password(password, year, month, length)

    result_label.config(text=f"您的密碼是: {password}")
    password_entry.delete(0, tk.END)
    password_entry.insert(0, password)
    pyperclip.copy(password)

def show_error(message):
    """顯示錯誤訊息。"""
    tk.messagebox.showwarning("警告", message)

def main():
    """創建主窗口和UI元素。"""
    global result_label, password_entry, key_entry, year_entry, month_entry, length_var

    window = tk.Tk()
    window.title("密碼生成器 v2.1")

    key_label = tk.Label(window, text="金鑰:")
    key_label.grid(row=0, column=0, padx=5, pady=5)
    key_entry = tk.Entry(window)
    key_entry.grid(row=0, column=1, padx=5, pady=5)

    year_label = tk.Label(window, text="年份:")
    year_label.grid(row=1, column=0, padx=5, pady=5)
    year_entry = tk.Entry(window)
    year_entry.grid(row=1, column=1, padx=5, pady=5)

    month_label = tk.Label(window, text="月份:")
    month_label.grid(row=2, column=0, padx=5, pady=5)
    month_entry = tk.Entry(window)
    month_entry.grid(row=2, column=1, padx=5, pady=5)

    length_label = tk.Label(window, text="密碼長度 (可自行輸入,最少9字元):")
    length_label.grid(row=3, column=0, padx=4, pady=5)
    length_var = tk.StringVar(value="10")
    length_options = ["10", "15", "20"]
    length_dropdown = ttk.Combobox(window, textvariable=length_var, values=length_options)
    length_dropdown.grid(row=3, column=1, padx=5, pady=5)

    generate_button = tk.Button(window, text="生成密碼", command=password_output)
    generate_button.grid(row=4, column=0, columnspan=2, padx=5, pady=5)

    result_label = tk.Label(window, text="")
    result_label.grid(row=5, column=0, columnspan=2, padx=5, pady=5)

    password_entry = tk.Entry(window, width=30)
    password_entry.grid(row=6, column=0, padx=5, pady=5)

    def copy_password():
        password = password_entry.get()
        pyperclip.copy(password)

    copy_button = tk.Button(window, text="複製", command=copy_password)
    copy_button.grid(row=6, column=1, padx=5, pady=5)

    window.mainloop()

if __name__ == "__main__":
    main()