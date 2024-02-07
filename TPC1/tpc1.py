from flask import Flask, render_template_string, send_file
import os
import xml.etree.ElementTree as ET

app = Flask(__name__)

# Diretório onde estão os arquivos XML
DIRECTORY = 'MapaRuas-materialBase/texto'

# Lista de nomes de arquivos para criar arquivos XML
file_names = ['file1', 'file2', 'file3']  # Exemplo, substituir pela lógica de obtenção de nomes

def create_xml_files(names):
    for name in names:
        root = ET.Element("root")
        ET.SubElement(root, "file").text = name
        tree = ET.ElementTree(root)
        tree.write(os.path.join(DIRECTORY, f"{name}.xml"))

@app.route('/')
def list_xml_files():
    create_xml_files(file_names)

    files = [f for f in os.listdir(DIRECTORY) if f.endswith('.xml')]
    files_with_links = [f'<a href="/file/{f}">{f}</a>' for f in files]
    return '<br>'.join(files_with_links)

@app.route('/file/<filename>')
def show_file_content(filename):
    file_path = os.path.join(DIRECTORY, filename)
    if os.path.exists(file_path) and file_path.endswith('.xml'):
        return send_file(file_path)
    return 'File not found', 404

app.run(host="0.0.0.0", port=80)

