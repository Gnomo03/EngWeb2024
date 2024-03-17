def corrigir_json(input_file, output_file):

    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.readlines()
    
    corrected_content = ['{"filmes":[\n'] + content + [']\n}']
    corrected_content = [line.rstrip('\n') + ',\n' if i < len(corrected_content) - 2 else line for i, line in enumerate(corrected_content)]
    
    all_content = ''.join(corrected_content)

    comma_index = all_content.find(',')
    if comma_index != -1:
        all_content = all_content[:comma_index] + all_content[comma_index+1:]
    
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(all_content)

corrigir_json('filmes.json', 'filmes_corrigido.json')
