import json

def preparar_para_mongodb(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)['pessoas']  # Acessa diretamente o array 'pessoas'

    # Escreve os dados processados de volta em um arquivo JSON
    with open(output_file, 'w', encoding='utf-8') as file:
        for i, pessoa in enumerate(data):
            # Escreve o objeto pessoa como um documento JSON
            json.dump(pessoa, file, ensure_ascii=False)
            # Adiciona uma vírgula no final de cada objeto, exceto no último
            if i < len(data) - 1:
                file.write(',')
            file.write('\n')  # Adiciona uma nova linha após cada documento

input_json = 'dataset.json'
output_json = 'dataset.json'

preparar_para_mongodb(input_json, output_json)