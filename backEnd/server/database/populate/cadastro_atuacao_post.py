import requests
from faker import Faker
fake = Faker(locale='pt_BR')
Authorization = 'WyIxIiwiJDUkcm91bmRzPTUzNTAwMCRuckRONzMweWNpZmxpSjNrJFo3eFZYL08xSXMwTGdCVzNUUWtvVk52LmticjdOeTNYWVFuMWVtNk9BY0EiXQ.FuQAJw.y9TA_AzVRMclrOCCuwu9JSoa_70'
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'pt-BR,pt;q=0.9',
    'Authorization': Authorization,
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'Origin': 'http://127.0.0.1:2222',
    'Pragma': 'no-cache',
    'Referer': 'http://127.0.0.1:2222/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

try:
    json_data = {
        'n_processo': int(fake.bothify(text='#####')),
        'id_alerta': fake.bothify(text='###-##'),
        'cod_infracao': int(fake.bothify(text='#')),
        'monitoramento_embargo': fake.bothify(text='###.###'),
        'n_auto_infracao': int(fake.bothify(text='####')),
        'serie_auto_infracao': fake.bothify(text='?#'),
        'ano': int(fake.bothify(text='201#')),
        'termo_compromisso': fake.bothify(text='###/####'),
        'descricao_sancao_aplicada': fake.bothify(text='ART. ###'),
        'nome_imovel': fake.name(),
        'localizacao_imovel': fake.address().replace("'", ""),
        'cod_municipio': int(fake.bothify(text='#')),
        'area_imovel': fake.bothify(text='######'),
        'nome_autuado': fake.name(),
        'cpf': fake.bothify(text='###.###.###-##'),
       
        'zona': fake.bothify(text='##?'),
        'coordenadas': [
            {
                'cood_x': float(fake.bothify(text='#####.##')),
                'cood_y': float(fake.bothify(text='######.##')),
                'descricao_coord': fake.name(),
            },
            {
                'cood_x': float(fake.bothify(text='#####.##')),
                'cood_y': float(fake.bothify(text='######.##')),
                'descricao_coord': fake.name(),
            },
        ],
        'fiscal': [
            {
                'fiscal': fake.name(),
            },
            {
                'fiscal': fake.name(),
            },
        ],
        'cod_usuario': 1,
    }
    print(json_data)
    
    response = requests.post('http://127.0.0.1:5001/api/autuacao', headers=headers, json=json_data)

    print(response)
except:
    print('ERROR\n')
