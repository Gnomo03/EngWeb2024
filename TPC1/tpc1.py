import os
import xml.etree.ElementTree as ET
from lxml import etree


# Diretório onde estão os arquivos XML
DIRECTORY = 'MapaRuas-materialBase/texto'
FILE = 'MRB-01-RuaDoCampo'
xmlFile = DIRECTORY + f'/{FILE}.xml'
xltFile = 'transform.xsl'
BASEDIR='.'

htmlFile = DIRECTORY +  f'/{FILE}.html'
htmlIndex= BASEDIR +  f'/index.html'

# Parse the XML and XSLT
xml = etree.parse(xmlFile)
xslt = etree.parse(xltFile)

# Transform the XML
transform = etree.XSLT(xslt)
new_doc = transform(xml)

# Convert the result to a string
transformed_html = str(new_doc)

# Print the transformed document
print(transformed_html)

# Write the transformed HTML to a file
with open(htmlFile, 'w') as file:
    file.write(transformed_html)
