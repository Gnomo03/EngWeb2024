import json

# Passo 1: Ler o arquivo compositores.json
with open('compositores.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Passo 2: Processar as informações para criar um dicionário dos períodos
periodos_dict = {}
for compositor in data['compositores']:
    if 'nome' in compositor and 'periodo' in compositor:
        periodo = compositor['periodo']
        if periodo not in periodos_dict:
            periodos_dict[periodo] = []
        periodos_dict[periodo].append(compositor['nome'])
    else:
        # Ignora a entrada se não for um compositor válido
        continue

# Passo 3: Criar a nova lista com informações dos períodos
periodos_lista = []
for idx, (periodo, compositores) in enumerate(periodos_dict.items(), start=1):
    periodos_lista.append({
        'id': f'P{idx}',
        'nome': periodo,
        'numeroCompositores': len(compositores)
    })

# Passo 4: Adicionar a nova lista aos dados originais
data['periodos'] = periodos_lista

# Passo 5: Escrever os dados atualizados de volta ao arquivo JSON
with open('compositores_atualizado.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("Arquivo 'compositores_atualizado.json' criado com sucesso!")
