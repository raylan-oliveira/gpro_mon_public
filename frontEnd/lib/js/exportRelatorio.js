const arrayTitleExcelCsv = [
    { header: 'N_PROCESSO', key: 'n_processo' },
    { header: 'ID_ALERTA', key: 'id_alerta' },
    { header: 'NOME_IMOVEL', key: 'nome_imovel' },
    { header: 'NOME_AUTUADO', key: 'nome_autuado' },
    { header: 'CPF_CNPJ', key: 'cpf' },
    { header: 'NUM_AUTO_INFRACAO', key: 'num_auto_infracao' },
    { header: 'SERIE_AUTO_INFRACAO', key: 'serie_auto_infracao' },
    { header: 'SANCAO_APLICADA', key: 'descricao_infracao' },
    { header: 'LOCALIZACAO_IMOVEL', key: 'localizacao_imovel' },
    { header: 'NOM_MUNICIPIO', key: 'descricao_municipio' },
    { header: 'AREA_IMOVEL', key: 'area_imovel' },
    { header: 'DESCRICAO_SANCAO_APLICADA', key: 'descricao_sancao_aplicada' },
    { header: 'TERMO_DE_COMPROMISSO', key: 'termo_compromisso' },
    { header: 'ZONA', key: 'zona' },
    { header: 'X', key: 'cood_x' },
    { header: 'Y', key: 'cood_y' },
    { header: 'DESCRICAO_COORDENADA', key: 'descricao_coord' },
    { header: 'ANO', key: 'ano' },
    { header: 'MONITORAMENTO_EMBARGO', key: 'monitoramento_embargo' },
    { header: 'FISCAL', key: 'fiscal' },
    { header: 'DATA_CADASTRO', key: 'data_criacao' }
]

class exportExcel extends ExcelJS.Workbook {
    constructor(arrayExport) {
        super()
        // create this.workbook & add this.worksheet
        //var this.workbook = new ExcelJS.this.workbook();

        this.worksheet = this.addWorksheet('Embargo');

        // add column headers
        this.worksheet.columns = arrayTitleExcelCsv

        if (arrayExport && arrayExport.length > 0) {
            arrayExport.map((element) => {

                this.worksheet.addRow({
                    n_processo: element.n_processo,
                    id_alerta: element.id_alerta,
                    nome_imovel: element.nome_imovel,
                    nome_autuado: element.nome_autuado,
                    cpf: element.cpf,
                    num_auto_infracao: element.num_auto_infracao,
                    serie_auto_infracao: element.serie_auto_infracao,
                    descricao_infracao: element.descricao_infracao,
                    localizacao_imovel: element.localizacao_imovel,
                    descricao_municipio: element.descricao_municipio,
                    area_imovel: element.area_imovel,
                    descricao_sancao_aplicada: element.descricao_sancao_aplicada,
                    termo_compromisso: element.termo_compromisso,
                    zona: element.zona,
                    cood_x: element.cood_x,
                    cood_y: element.cood_y,
                    descricao_coord: element.descricao_coord,
                    ano: element.ano,
                    monitoramento_embargo: element.monitoramento_embargo,
                    fiscal: element.fiscal,
                    data_criacao: element.data_criacao

                });
            })

            var path = "Relatorio.xlsx";
            var mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.xlsx.writeBuffer()
                .then(function (data) {
                    var blob = new Blob([data], { type: mimeType });

                    saveAs(blob, path);
                    console.log('File written!');
                });
        }
    }

}
function toStringEndClean(toString) {
    return String(toString).replaceAll('\n', ' / ').replaceAll('\t', '').replaceAll(',', '.').replaceAll(';', ':')
}
class exportCSV {
    constructor(arrayExport) {
        if (arrayExport && arrayExport.length > 0) {
        let sep = ','
        this.arrayExport = arrayExport

        arrayTitleExcelCsv.map((elementArray, indexArray) => {
            if (indexArray === 0) {
                this.lineTitleCsv = elementArray.header
            } else {
                this.lineTitleCsv += sep + elementArray.header
            }

        })

        this.arrayExport.map((elementArray, indexArray) => {
            
            let linhaArray = toStringEndClean(elementArray.n_processo) + sep + toStringEndClean(elementArray.id_alerta) + sep + toStringEndClean(elementArray.nome_imovel) + sep + toStringEndClean(elementArray.nome_autuado) + sep + toStringEndClean(elementArray.cpf) + sep + toStringEndClean(elementArray.num_auto_infracao) + sep + toStringEndClean(elementArray.serie_auto_infracao) + sep + toStringEndClean(elementArray.descricao_infracao) + sep + toStringEndClean(elementArray.localizacao_imovel) + sep + toStringEndClean(elementArray.descricao_municipio) + sep + toStringEndClean(elementArray.area_imovel) + sep + toStringEndClean(elementArray.descricao_sancao_aplicada) + sep + toStringEndClean(elementArray.termo_compromisso) + sep + toStringEndClean(elementArray.zona) + sep + toStringEndClean(elementArray.cood_x) + sep + toStringEndClean(elementArray.cood_y) + sep + toStringEndClean(elementArray.descricao_coord) + sep + toStringEndClean(elementArray.ano) + sep + toStringEndClean(elementArray.monitoramento_embargo) + sep + toStringEndClean(elementArray.fiscal) + sep + toStringEndClean(elementArray.data_criacao)

            linhaArray = linhaArray.replaceAll('undefined', '')
            linhaArray = linhaArray.replaceAll('null', '')

            if (indexArray === 0) {
                this.linesCsv = linhaArray + '\n'
                console.log(linhaArray)
            } else {

                this.linesCsv += linhaArray + '\n'
            }

        })
        this.csvFile = this.lineTitleCsv + '\n' + this.linesCsv
        let path = "Relatorio.csv";
        let mimeType = "text/csv";
        var blob = new Blob([this.csvFile], { type: mimeType });

        saveAs(blob, path);
        console.log('File written!');
    }

    }

}