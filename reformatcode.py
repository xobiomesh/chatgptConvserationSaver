import os
import re
import tkinter as tk
from tkinter import filedialog

def reformat_text(input_text):
    def replace_code_block(match):
        code_content = match.group(1).strip()
        # Detect language from the first word in the code content, otherwise default to 'python'
        language = 'python' if 'import' in code_content else 'sh'
        return f"```{language}\n{code_content}\n```"
    
    # Remove "Copy code" mentions and format code blocks
    formatted_text = re.sub(r'```\nCopy code\n`(.+?)`\n```', replace_code_block, input_text, flags=re.DOTALL)
    
    return formatted_text

# Function to open a file dialog and read the input file
def select_input_file():
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(title="Select input text file")
    with open(file_path, 'r', encoding='utf-8') as file:
        input_text = file.read()
    return input_text, file_path

# Function to save the formatted text to a new file
def save_output_file(formatted_text, input_file_path):
    output_file_path = filedialog.asksaveasfilename(title="Save formatted text as", defaultextension=".txt", initialfile="formatted_" + os.path.basename(input_file_path))
    with open(output_file_path, 'w', encoding='utf-8') as file:
        file.write(formatted_text)
    print(f"Formatted text saved to {output_file_path}")

if __name__ == "__main__":
    input_text, input_file_path = select_input_file()
    formatted_text = reformat_text(input_text)
    save_output_file(formatted_text, input_file_path)
