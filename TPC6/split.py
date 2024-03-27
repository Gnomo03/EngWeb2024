import json

# Caminho do arquivo JSON original
caminho_arquivo_original = 'compositores_atualizado.json'

# Abrindo e lendo o arquivo JSON
with open(caminho_arquivo_original, 'r', encoding='utf-8') as arquivo:
    dados = json.load(arquivo)

# Extração dos arrays
compositores = dados['compositores']
periodos = dados['periodos']

# Salvando o array de compositores em um novo arquivo JSON
with open('compositores.json', 'w', encoding='utf-8') as arquivo_compositores:
    json.dump(compositores, arquivo_compositores, ensure_ascii=False, indent=4)

# Salvando o array de períodos em um novo arquivo JSON
with open('periodos.json', 'w', encoding='utf-8') as arquivo_periodos:
    json.dump(periodos, arquivo_periodos, ensure_ascii=False, indent=4)

print("Arrays extraídos e salvos com sucesso.")
