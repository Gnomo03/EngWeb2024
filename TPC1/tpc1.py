import os
import xml.etree.ElementTree as ET
import ruas

class meta:
    def __init__(self, numero, nome):
        self.numero = numero
        self.nome = nome
    def __repr__(self):
        return f"meta(numero='{self.numero}', nome='{self.nome}')"

class figura:
    def __init__(self, id, imagePath, legenda):
        self.id = id
        self.imagemPath = imagePath
        self.legenda = legenda
    def __repr__(self):
        return f"figura(imagem='id={self.id}, imagemPath={self.imagemPath}', legenda='{self.legenda}')"

class corpo:
    def __init__(self,  figuras ):
        self.figuras = figuras
    def __repr__(self):
        result = "[\n"
        for fig in self.figuras:
            result += f'{fig},\n';
        result += "]"
        return result

class rua:
    def __init__(self, meta, corpo ):
        self.meta = meta
        self.corpo = corpo
    def __repr__(self):
        result=f'rua({self.meta}\n{self.corpo})'
        return result


# Diretório onde estão os arquivos XML
DIRECTORY = 'data/texto'
file1=DIRECTORY + "/MRB-01-RuaDoCampo.xml"

x = ruas.parse(file1)

tree = ET.parse(file1)
rua_elem = tree.getroot()

meta_elem = rua_elem.find('meta')
corpo_elem = rua_elem.find('corpo')

meta = meta(meta_elem.find('número').text, meta_elem.find('nome').text)

figuras = []
for figura_elem in corpo_elem.findall('figura'):
    image = figura_elem.find('imagem')
    id = figura_elem.attrib.get("id")
    imagePath = image.get("path")
    legenda = figura_elem.find('legenda').text
    fig = figura(id, imagePath, legenda )
    figuras.append(fig)

cp = corpo(figuras)
rua=rua( meta, cp )

print(rua)
