import json
import requests

# Substitua pela URL do endpoint da sua API
api_endpoint = "http://localhost:3000/pessoas"

# Lista dos nomes dos arquivos JSON
datasets = ["dataset-extra1.json", "dataset-extra2.json", "dataset-extra3.json"]

for dataset in datasets:
    with open(dataset, 'r') as file:
        data = json.load(file)
        for pessoa in data['pessoas']:
            response = requests.post(api_endpoint, json=pessoa)
            if response.status_code == 201:
                print(f"Entrada adicionada com sucesso: {pessoa['nome']}")
            else:
                print(f"Erro ao adicionar entrada: {response.status_code}")

