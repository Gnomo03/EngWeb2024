import os
import xml.etree.ElementTree as ET
from lxml import etree
from transform import transformXML

# Caminho para a pasta que contém os arquivos html
pasta_xml = 'MapaRuas-materialBase/texto'

# Declaração XML padrão e instrução de processamento XSLT
declaracao_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
instrucao_xslt = '<?xml-stylesheet type="text/xsl" href="./transformacao.xsl"?>\n'

# Iniciar a estrutura básica do HTML
html = """
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Índice das Ruas</title>
</head>
<body>
    <h1>Lista de Ruas</h1>
    <ul>
"""

# Percorrer os arquivos na pasta de texto
for arquivo in os.listdir(pasta_xml):
    caminho_completo = os.path.join(pasta_xml, arquivo)
    # Verificar se o arquivo não é um dos ignorados e segue o padrão desejado
    if arquivo.startswith("MRB-") and arquivo.endswith(".xml"):
        with open(caminho_completo, 'r+') as f:
            conteudo = f.readlines()
            
            # Inserir declaração XML e instrução XSLT conforme necessário
            if not conteudo[0].startswith('<?xml'):
                conteudo.insert(0, declaracao_xml)
            if not conteudo[1].startswith('<?xml-stylesheet'):
                conteudo.insert(1, instrucao_xslt)
            
            f.seek(0)
            f.writelines(conteudo)
            f.truncate()

        # Transformar o xml em html e obter o caminho/nome do arquivo HTML gerado
        htmlFile = transformXML(arquivo)

        # Abrir o arquivo HTML para adicionar a linha de retorno
        caminho_html = os.path.join(htmlFile)
        with open(caminho_html, 'a') as html_f:
            # Adiciona a linha de regresso ao final do arquivo HTML
            html_f.write('<h6><a href="../../index.html">Voltar</a></h6>\n')

        # Continuar com a adição de um item de lista com link para o arquivo HTML
        nome_rua = arquivo.split('-')[2].split('.')[0]  # Remove a extensão e o prefixo
        html += f'        <li><a href="{htmlFile}">{nome_rua}</a></li>\n'

# Finalizar a estrutura do HTML
html += """
</ul>
</body>
</html>
"""

# Escrever o HTML em um arquivo
with open('index.html', 'w') as f:
    f.write(html)

print('Site HTML gerado com sucesso.')
