const nomeSistemaConst = 'GPRO - CIGMA - AUTUAÇÕES AMBIENTAIS'
const descricaoSistemaConst = 'AUTOS DE INFRAÇÕES E EMBARGOS'

function print(texto){
    console.log(texto)
}

function setThemeStartup(){
    if(localStorage.theme){document.documentElement.className = 'ng-scope ' + localStorage.theme;}
    else{document.documentElement.className = 'ng-scope ' + 'theme-light';}
    
}
setThemeStartup()
function normalizeString(string){
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
}
(function(){
    $(function() {
        $.mask.definitions['~'] = "[+-]";
        $(".maskCpf").mask("999.999.999-99");
        $(".maskData").mask("99/99/9999");
        $(".maskTelefone").mask("(99) 9999 - 9999");
        $(".maskSei").mask("99999.999999/9999-99");
        $(".maskCnpj").mask("99.999.999/9999-99");
    });
})();

function toDateFormater(dataValid){
    //console.log(dataValid)
    if (dataValid === null){return dataValid}
    if (dataValid.includes('/')){return dataValid}
    var objectDate = new Date(dataValid)

    var day = String(objectDate.getDate())
    var month = String(objectDate.getMonth()+1)
    var year = String(objectDate.getFullYear())
    if (day.length === 1) { day = '0' + day }
    if (month.length === 1) { month = '0' + month }

    return `${day}/${month}/${year}`
}

function validarAutuacao(){

    const regexText = /^[A-Za-zÀ-ü 0-9.(),-_;?:!]+$/
    const regexNumber = /^[0-9]+$/
    const regexFloat = /^[0-9,.]+$/
    const regexNProcessoTermoCompromisso = /^[0-9\/-]+$/
    const regexCpfCnpj = /^[0-9./-]+$/   
    
    const arrayForms = [
        {
            idLement: 'n_processo',
            titulo: 'Nº do Processo',
            regexElement: regexNProcessoTermoCompromisso,
            min: 2,
            max: 30,
            obrigatorio: true
        },
        {
            idLement: 'id_alerta',
            titulo: 'ID Alerta',
            regexElement: regexText,
            min: 2,
            max: 30,
            obrigatorio: false
        },
        {
            idLement: 'n_auto_infracao',
            titulo: 'Nº Auto de Infração',
            regexElement: regexNumber,
            min: 2,
            max: 30,
            obrigatorio: true
        },
        {
            idLement: 'serie_auto_infracao',
            titulo: 'Série Auto de Infração',
            regexElement: regexText,
            min: 1,
            max: 50,
            obrigatorio: true
        },
        {
            idLement: 'termo_compromisso',
            titulo: 'Termo de compromisso',
            regexElement: regexNProcessoTermoCompromisso,
            min: 2,
            max: 20,
            obrigatorio: false
        },
        {
            idLement: 'descricao_sancao_aplicada',
            titulo: 'Descrição da Sanção Aplicada',
            regexElement: regexText,
            min: 2,
            max: 600,
            obrigatorio: false
        },
        {
            idLement: 'nome_imovel',
            titulo: 'Nome do Imóvel',
            regexElement: regexText,
            min: 2,
            max: 100,
            obrigatorio: false
        },
        {
            idLement: 'localizacao_imovel',
            titulo: 'Localização do Imóvelno',
            regexElement: regexText,
            min: 2,
            max: 600,
            obrigatorio: true
        },
        {
            idLement: 'area_imovel',
            titulo: 'Área Imóvel (ha)',
            regexElement: regexFloat,
            min: 2,
            max: 30,
            obrigatorio: false
        },
        {
            idLement: 'nome_autuado',
            titulo: 'Nome do Autuado',
            regexElement: regexText,
            min: 2,
            max: 100,
            obrigatorio: true
        },
        {
            idLement: 'cnpj',
            titulo: 'CPF/CNPJ',
            regexElement: regexCpfCnpj,
            min: 9,
            max: 18,
            obrigatorio: false
        },
        {
            idLement: 'zona',
            titulo: 'Zona',
            regexElement: regexText,
            min: 2,
            max: 50,
            obrigatorio: true
        },
        {
            idLement: 'monitoramento_embargo',
            titulo: 'Monitoramento do Embargo',
            regexElement: regexText,
            min: 2,
            max: 50,
            obrigatorio: false
        }

    ]    

    for (let i = 0; i < arrayForms.length; i++) {
        const arrayElement = arrayForms[i]

        const elementFormsValue = document.getElementById(arrayElement.idLement).value
        if (arrayElement.obrigatorio) {
            // console.log('element obrigatorio')
            // console.log(arrayElement)
            // console.log(elementFormsValue)

            var testValidaInputText = validaInputText(arrayElement.titulo, elementFormsValue, arrayElement.min, arrayElement.max, arrayElement.regexElement)

            if (testValidaInputText) {

                let titlealert = testValidaInputText.title
                let textalert = testValidaInputText.text

                let messagealert = `${titlealert}\n${textalert}`

                alert(messagealert)
                document.getElementById(arrayElement.idLement).focus()
                return false
            }

        }
        else {
            // console.log('element nao obrigatorio')
            // console.log(arrayElement)
            // console.log(elementFormsValue)
            if (elementFormsValue.length > 0) {

                var testValidaInputText = validaInputText(arrayElement.titulo, elementFormsValue, arrayElement.min, arrayElement.max, arrayElement.regexElement)

                if (testValidaInputText) {

                    let titleAlert = testValidaInputText.title
                    let textAlert = testValidaInputText.text

                    let messageAlert = `${titleAlert}\n${textAlert}`

                    alert(messageAlert)
                    document.getElementById(arrayElement.idLement).focus()
                    return false
                }
            }
        }
    }  
    
   
    return true

}

function validaInputText(title,inputText, min, max, regex){
    if(String(inputText) == 'undefined' || String(inputText).length < min){        
        var text = `Preencha ${title.toLowerCase()} corretamente!`
        return  {
            'title': title,
            'text': text
        }
    }
    if(String(inputText).length > max){
        
        var text = `Somente ${max} caractere em ${title.toLowerCase()}!`
        return  {
            'title': title,
            'text': text
        }
        
    }
    if(regex){
        if(regex.test(inputText)){
            return false
        }else{
            var text = `Caractere inválido em ${title.toLowerCase()}!`
            
            return  {
                'title': title,
                'text': text
            }
        }
    }
    return false
    
}
function cleanInput(inputText){    
    var regex = /[^A-Za-zÀ-ü 0-9.(),-_;?:!]/g;
    inputText = inputText.replaceAll(regex, '')
    inputText = inputText.replaceAll(/\s+/g, ' ')
    return inputText.trim()
}
(function(){
    angular
        .module('gpro',[
            'ui.router',
            'ngStorage',
            'gpro.autuacao', 
            'gpro.relatorio',
            'gpro.admin',
            'gpro.usuario'
        ])
    .controller('navController', navController)
    .run(($transitions, $state) => {
        $transitions.onError({}, ($transitions) => {
            if ($transitions.$to().name !== 'login' && ($transitions.$to().name != $transitions.$from().name)) {
                $state.go('login');
            }
        })
    }).run(refreshHeaderHttp)
    .factory('httpInterceptor',($q,$state,$localStorage) => {
        return {
            response: (response) => {
                if (response.status === 401) {
                    console.log("Response 401")
                    $state.go('login')
                }
                return response || $q.when(response);
            },
            responseError: (rejection) => {
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection)
                    swal({
                        title:'Token Expirado',
                        text:'Seu token de acesso expirou, por favor faça login novamente.',
                        icon:'warning',
                        buttons:'OK'
                    })
                    $state.go('login')
                    delete $localStorage.usuario_logado
                    
                }
                return $q.reject(rejection);
            }
        }
    })
    .config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }])

    function refreshHeaderHttp($http, $localStorage) {
        // Mantém o token mesmo quando a página é atualizada
        if ($localStorage.usuario_logado)
            if($localStorage.usuario_logado.token)
                $http.defaults.headers.common.Authorization = $localStorage.usuario_logado.token
    }

    function navController($scope, LoginService, $localStorage, $rootScope){
        let vm = this
        vm.logout = logout
        $scope.$watch(() => {return $localStorage.usuario_logado}, (usuario) => vm.usuario = usuario)
        $rootScope.permissao_user = localStorage.permissao_user
        console.log('navController')
        function logout() {
            swal({
                title: "Sair",
                text: `${$localStorage.usuario_logado.name}, você deseja realmente sair do sistema?`,
                icon: "warning",
                buttons: ['Cancelar', 'Sair'],
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    LoginService.Logout()
                }
            });
        }
        vm.tema = tema
        function tema() {
            LoginService.tema()
        }
    }   
    
})();

(function(){
    angular.module('gpro')
        .config(routerConfig);
    
    function routerConfig($stateProvider, $urlRouterProvider){

        let stateLogin = {
            name: 'login',
            url: '/',
            templateUrl: './app/Login/login.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve:{
                redirect:(LoginService) => LoginService.verifyLogado()
            }
        }

        let statePrincipal = {
            name: 'principal',
            url: '/principal',
            templateUrl: './app/Principal/principal.html',
            resolve:{
                logado:(LoginService) => LoginService.Logado()
                
            }
        }
        
        $stateProvider.state(stateLogin)
        $stateProvider.state(statePrincipal)
        $urlRouterProvider.otherwise('/')
    }

})();
(function(){
    function configLoading($httpProvider){
        $httpProvider.interceptors.push('loadingInterceptor');
    }
    
    angular
        .module('gpro')
        .config(configLoading);
})();

(function(){
    function factoryLoading($q, $rootScope){
        $rootScope.nomeSistema = nomeSistemaConst
        $rootScope.descricaoSistema = descricaoSistemaConst
        return{
            request: function(config){
                $rootScope.loading = true;
                return config;
            }, 
            requestError: function(rejection){
                $rootScope.loading = false;
                return $q.reject(rejection);
            },
            response: function(response){
                $rootScope.loading = false;
                return response;
            },
            responseError: function(rejection){
                $rootScope.loading = false;
                return $q.reject(rejection);
            }
        };
    };
    
    angular
        .module('gpro')
        .factory('loadingInterceptor',factoryLoading);
})();

(function(){
    angular
        .module('gpro')
        .controller('loginController', loginController);

    function loginController($http, $rootScope, $location, LoginService){
        let vm = this
        vm.logar = logar
        $rootScope.permissao_user = localStorage.permissao_user
        vm.cadastrar_usuario = cadastrar_usuario
        vm.cadastrar_usuario_login = cadastrar_usuario_login
        
        init()
        function init(){
            console.log('Init loginController')
            lista_orgaos()
        }

        function cadastrar_usuario_login(){
            $('#modal_cadastrar_usuario').modal('show')
        }
        function lista_orgaos() {
            if (!$rootScope.orgaos) {
            $http.get(`${server.api()}orgao`).then(response=>{
                if ($rootScope.orgaos != response.data){
                    $rootScope.orgaos = response.data
                }
            })
            }
        }
        function logar(){
            
            vm.loading = true;
            vm.mensagem='';
            LoginService.Login(vm.usuario.email, vm.usuario.password, result => {
                
                if (result === true) {
                    $location.path('/principal')

                    // lista_municipios()
                    if (!$rootScope.municipios) {
                        $http.get(`${server.api()}municipio`).then(response => {
                            if ($rootScope.municipios != response.data) {
                                $rootScope.municipios = response.data
                            }
                        })
                    }

                } 
                else{
                    vm.mensagem = 'Email ou senha incorretos!'
                    vm.loading = false
                    console.log(vm.mensagem)
                }
                
            });
        }
        function cadastrar_usuario(dados_usuario){
            if (dados_usuario.password == dados_usuario.retry_password){
                $http.post(`${server.api()}usuario`, dados_usuario).then(response=>{msg = "Email já cadastrado."
                    if (response.status === 200){
                        swal({
                            title:'Cadastro de Usuário',
                            text:response.data,
                            icon:'success',
                            button:'Concluir'
                        })
                    }else if (response.status === 204){
                        swal({
                            title:'Usuário não cadastrado',
                            text: msg,
                            icon:'warning',
                            button:'Fechar'
                        })
                    }
                    console.log(response)
                }).catch(erro=>{
                    console.log(erro)
                    swal({
                            title:'Erro no SERVIDOR',
                            text:'Não foi possível realizar o cadastro!',
                            icon:'error',
                            button:'Fechar'
                        })
                })
            }
            else {
                swal({
                    title: 'Senha',
                    text: 'Senhas não são iguais',
                    icon: 'warning',
                    button: 'Fechar'
                })

            }
        }
    };

})();

(function () {
    angular
        .module('gpro')
        .factory('LoginService', Service);

    function Service($q, $http, $localStorage, $location, $state, $rootScope) {
        let service = {}

        $q.bind(this)

        service.Login = Login
        service.Logout = Logout
        service.tema = tema
        service.Logado = Logado
        service.verifyLogado = verifyLogado 

        return service

        function Logado(){
            if(!$localStorage.usuario_logado){
                return $q.reject('Usuário não Logado');
            }
        }

        function verifyLogado(){
            if(!$localStorage.usuario_logado){
                $q.reject('Usuário não Logado');
            }else{
                $state.go('principal')
            }
        }


        function Login(email, password, callback) {
            delete $http.defaults.headers.common.Authorization
            
            $http.post(`${server.api()}login`, { email: email, password: password })
                .then(response => {
                    const token = response.data.response.user.authentication_token
                    const user_id = response.data.response.user.id

                    $localStorage.usuario_logado = response.data.response.user
                    $localStorage.usuario_logado.token = token

                    localStorage.permissao_user = response.data.response.user.permissao_user
                    $rootScope.permissao_user = localStorage.permissao_user
                    $http.defaults.headers.common.Authorization = token
                    callback(true)
                    
                    // if (token) {
                    //     $http.get(`${server.api()}usuario/${user_id}`)
                    //     .then(response => {
                    //         $localStorage.usuario_logado = response.data
                    //         $localStorage.usuario_logado.token = token
                    //         callback(true)
                    //         })
                    // } else {
                    //     callback(false)
                    // }
                }).catch(error=>{
                    callback(error)
                })
        }

        function Logout() {
            delete $localStorage.usuario_logado
            delete localStorage.permissao_user
            $http.get(`${server.api()}logout`)
                .then(
                    (response) => {
                        console.log('Logout Success')
                    },
                    (error) => {
                        console.log('Logout Success')
                    }
            )
            $http.defaults.headers.common.Authorization = ''
            $location.path('/login')
        }
        function tema(){
            console.log('tema')
            var classListHTML = [...document.documentElement.classList]
           
            if (classListHTML.includes('theme-dark')) {                
                setTheme('theme-light');
            } else {
                setTheme('theme-dark');
                
            }
        }
        function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            
            document.documentElement.className = 'ng-scope ' + themeName;
        }
        
    }
})();
(function(){
    angular
        .module('gpro.autuacao',[]);
})();
(function(){
    angular
        .module('gpro.autuacao')
        .config(configCadastrarAutuacaoRouter)
    
    function configCadastrarAutuacaoRouter($stateProvider) {
        let stateAutuacao={
            abstract:true,
            name:'autuacao',
            url:'/autuacao',
            templateUrl:'./app/Autuacao/views/autuacao.html',
            resolve:{
                logado:(LoginService)=>LoginService.Logado()
            }
        }

        let stateAutuacaoCadastrar={
            name:'autuacao.cadastrar_autuacao',
            url:'/cadastrar_autuacao',
            templateUrl:'./app/Autuacao/views/cadastrar_autuacao.html',
            controller:'AutuacaoController',
            controllerAs:'vm',
        }

        let statePesquisaAutuacao={
            name:'autuacao.pesquisar_autuacao',
            url:'/pesquisar',
            templateUrl:'./app/Autuacao/views/pesquisar_autuacao.html',
            controller:'PesquisarAutuacaoController',
            controllerAs:'vm',
        }

        $stateProvider.state(stateAutuacao)
        $stateProvider.state(stateAutuacaoCadastrar)
        $stateProvider.state(statePesquisaAutuacao)
        
    }
    
})();
(function(){
    angular
        .module('gpro.relatorio',[])
})();
(function(){
    angular
        .module('gpro.relatorio')
        .config(routerConfigRelatorio);
    
    function routerConfigRelatorio($stateProvider, $urlRouterProvider){

        let stateRelatorio = {
            abstract:true,
            name:'relatorio',
            url:'/relatorio',
            templateUrl:'./app/Relatorio/views/relatorio.html',
            resolve:{
                logado:(LoginService)=>LoginService.Logado()
            }
        }

        let stateGerarRelatorioautuacao = {
            name: 'relatorio.gerar_relatorio_autuacao',
            url: '/gerar_relatorio_autuacao',
            templateUrl: './app/Relatorio/views/gerar_relatorio_autuacao.html',
            controller: 'RelatorioController',
            controllerAs: 'vm',
        }
        
        $stateProvider.state(stateRelatorio)
        $stateProvider.state(stateGerarRelatorioautuacao)
        $urlRouterProvider.otherwise('/')
    }

})();

(function(){
    angular
        .module('gpro.admin',[])
}
)();
(function(){
    angular
        .module('gpro.admin')
        .config(ConfigRouterAdmin)

    function ConfigRouterAdmin($stateProvider){
        
        let stateAdmin={
            abstract:true,
            name:'admin',
            url:'/admin',
            templateUrl:'./app/Admin/views/admin.html',
            resolve:{
                logado:(LoginService)=>LoginService.Logado()
            }
        }

        let stateAdminMenu={
            name:'admin.admin',
            url:'/admin_menu',
            templateUrl:'./app/Admin/views/admin_menu.html',
            controller:'AdminController',
            controllerAs:'vm',
            resolve:{
                usuario_logado: ($http, $rootScope, $localStorage) => {
                    $rootScope.loadingIndex = true
                    return $http.get(`${server.api()}usuario/${$localStorage.usuario_logado.id}`)
                    .then(
                        (response) => {
                            console.log(response.data[0])
                            $rootScope.loadingIndex = false
                            if (response.data.cod_permissao_user != 1){
                                throw new Error('Sem Permissão ADMIN');
                            }
                            return
                        },
                        (error) => {
                            $rootScope.loadingIndex = false
                            return error
                        }
                    )
                },
            }
        }

        let stateAdminAtivarUsuario={
            name:'admin.ativar_usuario',
            url:'/admin_ativar_usuario',
            templateUrl:'./app/Admin/views/admin_ativar_usuario.html',
            controller:'AdminController',
            controllerAs:'vm',
        }
        let stateAdminGerarCodAtivacao={
            name:'admin.gerar_cod_ativacao',
            url:'/admin_gerar_cod_ativacao',
            templateUrl:'./app/Admin/views/admin_gerar_cod_ativacao.html',
            controller:'AdminController',
            controllerAs:'vm',
        }
        let stateAdmiConsultaCodAtivacao={
            name:'admin.consulta_cod_ativacao',
            url:'/admin_consulta_cod_ativacao',
            templateUrl:'./app/Admin/views/admin_consulta_cod_ativacao.html',
            controller:'AdminController',
            controllerAs:'vm',
        }        

        
        $stateProvider.state(stateAdmin)
        $stateProvider.state(stateAdminMenu)
        $stateProvider.state(stateAdminAtivarUsuario)
        $stateProvider.state(stateAdminGerarCodAtivacao)
        $stateProvider.state(stateAdmiConsultaCodAtivacao)
    }
})();
(function(){
    angular
        .module('gpro.usuario',[])
}
)();
(function(){
    angular
        .module('gpro.usuario')
        .config(ConfigRouterUsuario)

    function ConfigRouterUsuario($stateProvider){
        let stateUsuario={
            abstract:true,
            name:'usuario',
            url:'/usuario',
            templateUrl:'./app/Usuario/views/usuario.html',
            resolve:{
                logado:(LoginService)=>LoginService.Logado()
            }
        }
        
       

        let stateEditarUsuario={
            name:'usuario.editar_usuario',
            url:'/editar_usuario',
            templateUrl:'./app/Usuario/views/editar_usuario.html',
            controller:'UsuarioController',
            controllerAs:'vm',
            resolve:{
                usuario_logado: ($http, $rootScope, $localStorage) => {
                    $rootScope.loadingIndex = true
                    return $http.get(`${server.api()}usuario/${$localStorage.usuario_logado.id}`)
                    .then(
                        (response) => {
                            $rootScope.loadingIndex = false
                            return response.data[0]
                        },
                        (error) => {
                            $rootScope.loadingIndex = false
                            return error
                        }
                    )
                },
            }
        }

        $stateProvider.state(stateUsuario)
        $stateProvider.state(stateEditarUsuario)
    }
})();

(function(){
    angular
        .module('gpro.autuacao')
        .controller('AutuacaoController', configAutuacaoController)
    function configAutuacaoController($http, $rootScope, $scope, $localStorage){
        vm = this
        $rootScope.permissao_user = localStorage.permissao_user
        vm.cadastrar_autuacao = cadastrar_autuacao
        vm.addCoordenadas = addCoordenadas
        vm.deletarCood = deletarCood
        vm.deletarFiscal = deletarFiscal
        vm.addFiscal = addFiscal
        vm.arrayCorrdenada = []
        vm.arrayFiscal = []
        
        init()
        function init(){
            console.log('Init Cadastrar Autuacao Controller')
            
            lista_municipios()
            lista_infracoes()
            delete $rootScope.autuacao
        }

        function lista_municipios() {
            if (!$rootScope.municipios) {
            $http.get(`${server.api()}municipio`).then(response=>{
                if ($rootScope.municipios != response.data){
                    $rootScope.municipios = response.data
                }
            })
            }
        }
        function lista_infracoes() {
            if (!$rootScope.infracoes) {
            $http.get(`${server.api()}infracao`).then(response=>{
                if ($rootScope.infracoes != response.data){
                    $rootScope.infracoes = response.data
                }
            })
            }
        }
        
        function addCoordenadas(cood_x,cood_y,descricao_coord){
            
            if(cood_x==='' || cood_y=='' || descricao_coord==''){
                return
            }

            if(typeof cood_x==='undefined' || typeof cood_y==='undefined' || typeof descricao_coord==='undefined'){
                return
            }
            var id_cood = vm.arrayCorrdenada.length
            var objCoords = {
                'id_cood': id_cood,
                'cood_x':cood_x,
                'cood_y':cood_y,
                'descricao_coord':descricao_coord
            }
            print(objCoords)
            vm.arrayCorrdenada.push(objCoords)
            
        }
        function deletarCood(coordId){  
            
            delete vm.arrayCorrdenada[coordId]
            var newArray = []
            var newId = 0
            for(var item of vm.arrayCorrdenada){                

                if(String(item)!='undefined'){
                    
                    item.id_cood = newId
                    newArray.push(item)
                    newId++
                }
            }
            delete vm.arrayCorrdenada
            vm.arrayCorrdenada = newArray
        }
        function addFiscal(fiscal){
            print(fiscal)
            if(fiscal===''){
                return
            }

            if(typeof fiscal==='undefined'){
                return
            }
            var id_fiscal = vm.arrayFiscal.length
            var objFiscal = {
                'id_fiscal': id_fiscal,
                'fiscal': fiscal
            }
            vm.arrayFiscal.push(objFiscal)
        }
        function deletarFiscal(fiscalId){  

            delete vm.arrayFiscal[fiscalId]
            var newArray = []
            var newId = 0
            for(var item of vm.arrayFiscal){
                

                if(String(item)!='undefined'){

                    item.id_fiscal = newId
                    newArray.push(item)
                    newId++
                }
            }
            delete vm.arrayFiscal
            vm.arrayFiscal = newArray
        }
        
        function cadastrar_autuacao(autuacao){
            console.log(autuacao)
            if(!autuacao){return}
            
            console.log('cadastrar_autuacao => validarAutuacao')
            
            var formIsValid = validarAutuacao()
            if (formIsValid==false){return}
            
            var idElement = 'coordenadas'
            
            if (vm.arrayCorrdenada.length > 0) {

                // Coordenada X
                let ElementById = document.getElementById(idElement).value
                console.log(ElementById)
                if (ElementById.length>0){
                    let titleAlert = 'Coordenadas Planas (UTM)'
                    let textAlert = 'ADICIONE a Coordenada X'

                    let messageAlert = `${titleAlert}\n${textAlert}`

                    alert(messageAlert)
                    document.getElementById(idElement).focus()
                    return
                }

                // Coordenada Y
                idElement = 'cood_y'
                ElementById = document.getElementById(idElement).value
                
                if (ElementById.length>0){
                    let titleAlert = 'Coordenadas Planas (UTM)'
                    let textAlert = 'ADICIONE a Coordenada Y'

                    let messageAlert = `${titleAlert}\n${textAlert}`

                    alert(messageAlert)
                    document.getElementById(idElement).focus()
                    return
                }

                // Descrição da Coordenada
                idElement = 'descricao_coord'
                ElementById = document.getElementById(idElement).value
                
                if (ElementById.length>0){
                    let titleAlert = 'Coordenadas Planas (UTM)'
                    let textAlert = 'ADICIONE a Descrição da Coordenada'

                    let messageAlert = `${titleAlert}\n${textAlert}`

                    alert(messageAlert)
                    document.getElementById(idElement).focus()
                    return
                }

                autuacao.coordenada = vm.arrayCorrdenada                

            } else {
                let titleAlert = 'Coordenadas Planas (UTM)'
                let textAlert = 'É necessário adicionar pelo menos uma Coordenada'

                let messageAlert = `${titleAlert}\n${textAlert}`

                alert(messageAlert)
                document.getElementById(idElement).focus()
                return

            }

            // Fiscal
            idElement = 'fiscal'
            ElementById = document.getElementById(idElement).value
            console.log(ElementById)
            if (ElementById.length>0){
                let titleAlert = 'Nome do Fiscal'
                let textAlert = 'ADICIONE o Fiscal'

                let messageAlert = `${titleAlert}\n${textAlert}`

                alert(messageAlert)
                document.getElementById(idElement).focus()
                return
            }

            if (vm.arrayFiscal.length > 0) {

                autuacao.fiscal=vm.arrayFiscal
            }
            
            if (formIsValid) {

                autuacao['cod_usuario'] = $localStorage.usuario_logado.id
                console.log(autuacao)
                $http.post(`${server.api()}autuacao`, autuacao).then(response => {

                    swal({
                        title: 'Cadastrado realizado com sucesso',
                        text: response.data,
                        icon: 'success',
                        button: 'Concluir'
                    })
                    $scope.autuacao = null
                    vm.arrayCorrdenada = []
                    vm.arrayFiscal = []


                }).catch(erro => {
                    console.log(erro)
                    if (erro.status == 450) {
                        swal({
                            title: 'Permissão',
                            text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão para CADASTRO`,
                            icon: 'warning',
                            button: 'Fechar'
                        })

                    } else {
                        swal({
                            title: 'Erro no SERVIDOR',
                            text: 'Não foi possível realizar o cadastro!',
                            icon: 'error',
                            button: 'Fechar'
                        })
                    }
                })

            }

        }

    }
})();
(function(){
    angular
        .module('gpro.autuacao')
        .controller('PesquisarAutuacaoController', configPesquisarAutuacaoController)

        function configPesquisarAutuacaoController($rootScope, $localStorage, $http) {
            let vm = this
            $rootScope.permissao_user = localStorage.permissao_user
            
            vm.lista_autuacoes = lista_autuacoes
            vm.addCoordenadas = addCoordenadas
            vm.deletarCood = deletarCood
            vm.pesquisar_autuacao = pesquisar_autuacao
            vm.deletar_autuacao = deletar_autuacao
            vm.editar_autuacao = editar_autuacao
            vm.atualizar_autuacao = atualizar_autuacao
            vm.deletarFiscal = deletarFiscal
            vm.addFiscal = addFiscal
            vm.arrayFiscal = []
            vm.arrayCorrdenada = []

            init()
            function init() {
                console.log('init configPesquisarAutuacaoController')
                vm.load=true
                /* lista_autuacoes()*/
                lista_municipios()
                lista_infracoes()
            }
            
            function lista_municipios() {
                if (!$rootScope.municipios) {
                $http.get(`${server.api()}municipio`).then(response=>{
                    if ($rootScope.municipios != response.data){
                        $rootScope.municipios = response.data
                    }
                })
                }
            }
            function lista_infracoes() {
                if (!$rootScope.infracoes) {
                $http.get(`${server.api()}infracao`).then(response=>{
                    if ($rootScope.infracoes != response.data){
                        $rootScope.infracoes = response.data
                    }
                })
                }
            }
            
            function lista_autuacoes(){
                $http.get(`${server.api()}autuacao/`).then(response=>{
                        
                        for (var i = 0; i < response.data.length; i++){
                            var data = toDateFormater(response.data[i].movimentacao_atual.data_movimentacao)
                            
                            response.data[i].movimentacao_atual.data_movimentacao = data
                            
                        }
                        console.log(response.data)
                        vm.autuacoes = response.data
                        vm.load=true
                    }
                )
            }
            
            function pesquisar_autuacao(params) {
                vm.arrayFiscal = []
                
                $http.post(`${server.api()}autuacao/pesquisa`, params).then(response=>{
                    console.log(response)
                    for (var i = 0; i < response.data.length; i++){

                        if (response.data[i].fiscal) {
                            let objArrayFiscal = []
                            let fiscalSplit = response.data[i].fiscal.split(',')

                            for (let i = 0; i < fiscalSplit.length; i++) {
                                
                                var objFiscal = {
                                    'id_fiscal': i,
                                    'fiscal': fiscalSplit[i]
                                }
                                
                                objArrayFiscal.push(objFiscal)
                                
                            }

                            response.data[i].fiscal = ''
                            response.data[i].fiscalArray = objArrayFiscal
                        }else{
                            response.data[i].fiscalArray = []
                        }
                        var data = toDateFormater(response.data[i].data_criacao)
                        response.data[i].data_criacao = data

                        if(response.data[i].qtd_area){response.data[i].qtd_area = String(response.data[i].qtd_area).replaceAll('.', ',')}
                        
                        if(response.data[i].cood_x){response.data[i].cood_x = String(response.data[i].cood_x).replaceAll('.', ',')}

                        if(response.data[i].cood_y){response.data[i].cood_y = String(response.data[i].cood_y).replaceAll('.', ',')}
                        
                    }
                    console.log(response.data)
                    vm.autuacoes = response.data
                    
                    
                }).catch(erro => {
                    console.log(erro)
                    if (erro.status == 450) {
                        swal({
                            title: 'Permissão',
                            text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão para VISUALIZAÇÃO`,
                            icon: 'warning',
                            button: 'Fechar'
                        })

                    } else {
                        swal({
                            title: 'Erro no SERVIDOR',
                            text: 'Não foi possível retornar a pesquisa!',
                            icon: 'error',
                            button: 'Fechar'
                        })
                    }
                })
            }
            
            function addCoordenadas(cood_x,cood_y,descricao_coord){
            
                if(cood_x==='' || cood_y=='' || descricao_coord==''){
                    return
                }
    
                if(typeof cood_x==='undefined' || typeof cood_y==='undefined' || typeof descricao_coord==='undefined'){
                    return
                }
                var id_cood = vm.arrayCorrdenada.length
                var objCoords = {
                    'id_cood': id_cood,
                    'cood_x':cood_x,
                    'cood_y':cood_y,
                    'descricao_coord':descricao_coord
                }
                print(objCoords)
                vm.arrayCorrdenada.push(objCoords)
                
            }
            
            function deletarCood(coordId){  
                
                delete vm.arrayCorrdenada[coordId]
                var newArray = []
                var newId = 0
                for(var item of vm.arrayCorrdenada){                
    
                    if(String(item)!='undefined'){
                        
                        item.id_cood = newId
                        newArray.push(item)
                        newId++
                    }
                }
                delete vm.arrayCorrdenada
                vm.arrayCorrdenada = newArray
            }

            function addFiscal(fiscal){
                print(fiscal)
                if(fiscal===''){
                    return
                }
    
                if(typeof fiscal==='undefined'){
                    return
                }
                var id_fiscal = vm.arrayFiscal.length
                var objFiscal = {
                    'id_fiscal': id_fiscal,
                    'fiscal': fiscal
                }
                
                vm.arrayFiscal.push(objFiscal)
                console.log(vm.arrayFiscal)
            }
            function deletarFiscal(fiscalId){  
                console.log('deletarFiscal')
                console.log(fiscalId)
                delete vm.arrayFiscal[fiscalId]
                var newArray = []
                var newId = 0
                for(var item of vm.arrayFiscal){
                    
    
                    if(String(item)!='undefined'){
    
                        item.id_fiscal = newId
                        newArray.push(item)
                        newId++
                    }
                }
                delete vm.arrayFiscal
                vm.arrayFiscal = newArray
            }
                  
            function atualizaArrayCorrdenada(arrayCorrdenada){
                let newArray = arrayCorrdenada
                
                // retorna os elementos do arrya somente quando não for nulo(quando existir)
                newArray = arrayCorrdenada.map((elementArray)=>{
                    if(elementArray){return elementArray}

                })
                
                return newArray
            }
            function editar_autuacao(autuacao_info){
                
                console.log('editar_autuacao')
                console.log(autuacao_info)                
                vm.arrayCorrdenada = autuacao_info.coordenada
                
                if (autuacao_info.fiscalArray) {
                    vm.arrayFiscal = autuacao_info.fiscalArray

                }

                $rootScope.autuacao = autuacao_info
                $('#modal_editar_autuacao').modal('show')
            }
            

            function atualizar_autuacao(autuacao_info) {
                console.log('atualizar_autuacao')
                console.log(autuacao_info)
                $rootScope.autuacao_info = autuacao_info
                
                autuacao_info.fiscalArray = vm.arrayFiscal
                autuacao_info.coordenada = vm.arrayCorrdenada
                
                var formIsValid = validarAutuacao()
                
                if (formIsValid) {

                    $http.put(`${server.api()}autuacao/${autuacao_info.cod_autuacao}`, autuacao_info).then(
                        response => {
                            swal({
                                title: 'Autuação atualizada',
                                text: response.data,
                                icon: 'success',
                                button: 'Ok'
                            })
                        }
                    ).catch(erro => {
                        console.log(erro)
                        if (erro.status == 450) {
                            swal({
                                title: 'Permissão',
                                text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão para CADASTRO`,
                                icon: 'warning',
                                button: 'Fechar'
                            })
    
                        } else {
                            swal({
                                title: 'Erro no SERVIDOR',
                                text: 'Não foi possível atualizar a AUTUAÇÃO!',
                                icon: 'error',
                                button: 'Fechar'
                            })
                        }
                    })
                }
            }
            
            function deletar_autuacao(cod_autuacao) {
                swal({
                    title: "Deletar Autuação",
                    text: `${$localStorage.usuario_logado.name}, você deseja realmente excluir esta Autuação?`,
                    icon: "warning",
                    buttons:['Cancelar', 'Excluir Agora'],
                    dangerMode: true,
                  }).then((willDelete)=>{
                    if (willDelete) {
                        $http.delete(`${server.api()}autuacao/${cod_autuacao}`).then(response=>{
                            
                            swal({
                                text: response.data,
                                icon: 'success',
                                button:'Ok'
                            });
                        }).catch(erro => {
                            console.log(erro)
                            if (erro.status == 450) {
                                swal({
                                    title: 'Permissão',
                                    text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão para EXCLUSÃO`,
                                    icon: 'warning',
                                    button: 'Fechar'
                                })

                            } else {
                                swal({
                                    title: 'Erro no SERVIDOR',
                                    text: 'Não foi possível excluir a autuação!',
                                    icon: 'error',
                                    button: 'Fechar'
                                })
                            }
                        })
                    } else {
                      swal({text:'A autuação não foi excluida', button:'Ok'});
                    }
                  });
            }
        
        }

})();
(function(){
    angular
        .module('gpro.relatorio')
        .controller('RelatorioController', configRelatorioController)
    function configRelatorioController($http, $rootScope, $localStorage){
        vm = this
        
        vm.exibir_relatorio = exibir_relatorio
        vm.gerar_excel = gerar_excel
        vm.gerar_csv = gerar_csv
        $rootScope.permissao_user = localStorage.permissao_user
        init()

        function init(){
            console.log('Init Relatorio Controller')
            
        }

        function exibir_relatorio(data_inicial, data_final, ordenadopor, asc_or_desc){
            
            if (typeof data_inicial === 'undefined' || data_inicial === '') {
                data_inicial = '01-01-1990'
            }
            if (typeof data_final === 'undefined' || data_final === '') {
                data_final = '31-12-2050'
            }
            if (typeof ordenadopor === 'undefined' || ordenadopor === '') {
                ordenadopor = 'data'
            }
            if (typeof asc_or_desc === 'undefined' || asc_or_desc === '') {
                asc_or_desc = "desc"
            }
            data_inicial = data_inicial.replaceAll('/', '-')
            data_final = data_final.replaceAll('/', '-')
            $http.get(`${server.api()}autuacao/relatorio/${data_inicial}/${data_final}/${ordenadopor}/${asc_or_desc}`).then(response=>{
                
                for (var i = 0; i < response.data.length; i++){
                    var data = toDateFormater(response.data[i].data_criacao)
                    
                    response.data[i].data_criacao = data
                    
                }
                console.log(response.data)
                vm.qtd_item = response.data.length
                vm.relatorio_lista = response.data
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão para VISUALIZAÇÃO`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível retornar o relatório!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })
        }

        function gerar_excel(arrayExport){
            console.log('gerar_excel')
            let excel = new exportExcel(arrayExport)
        }
        function gerar_csv(arrayExport){
            console.log('gerar_csv')
            let csv = new exportCSV(arrayExport)
        }
    }
    
})();

(function(){
    angular
        .module('gpro.usuario')
        .controller('UsuarioController', configUsuarioController)

    function configUsuarioController($http, $localStorage, $rootScope){
        vm = this
        vm.usuario = $localStorage.usuario_logado
        $rootScope.permissao_user = localStorage.permissao_user
        vm.atualizar_usuario = atualizar_usuario
        vm.atualizar_tema = atualizar_tema
        vm.usuario.tema =  $localStorage.theme
        init();
        function init(){
            console.log('Init Usuario Controller')
            console.log()
        }
        function atualizar_tema(tema){
            if(tema === '' || typeof tema === 'undefined'){return}
            
            localStorage.theme = tema
            document.documentElement.className = 'ng-scope ' + localStorage.theme;
            
            var tema = {tema: tema}
            
            $http.put(`${server.api()}tema/${vm.usuario.id}`, tema).then(response=>{
                if (response.status === 200){
                    swal({
                        title:'Tema Atualizado',
                        text:`${vm.usuario.name}, o tema das páginas foram atualizados`,
                        icon: 'success',
                        buttons: 'Ok'
                    })
                }
            }).catch(erro => {
                console.log(erro)
                swal({
                    title: 'Erro no SERVIDOR',
                    text: 'Não foi possível atualizar o tema!',
                    icon: 'error',
                    button: 'Fechar'
                })

            })
        }
        function atualizar_usuario(usuario){
            if(usuario.password!= usuario.retry_password){
                swal({
                    title:'Senhas Diferentes',
                    text:`${usuario.name}, as Senhas que vocês digitou estão diferentes!`,
                    icon: 'warning', 
                    buttons: 'OK'
                })
            }else{
                delete usuario.retry_password
                $http.put(`${server.api()}usuario/${usuario.id}`, usuario).then(response=>{
                    if (response.status === 200){
                        swal({
                            title:'Atualizado',
                            text:`${usuario.name}, seus dados foram atualizados`,
                            icon: 'success',
                            buttons: 'OK'
                        })
                        
                    }else if (response.status === 204){
                        swal({
                            title:`${usuario.name}, a Senha Antiga não confere.`,
                            text: response.data,
                            icon:'warning',
                            button:'Fechar'
                        })
                    }
                    
                }).catch(erro => {
                    console.log(erro)

                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível a atualização do usuário!',
                        icon: 'error',
                        button: 'Fechar'
                    })

                })
            }
            
        }
    }
})();
(function(){
    angular
        .module('gpro.admin')
        .controller('AdminController', configAdminController)

    function configAdminController($http, $localStorage, $rootScope){
        vm = this
        vm.usuario = $localStorage.usuario_logado
        $rootScope.permissao_user = localStorage.permissao_user
        
        vm.pesquisa_ativar_usuario = pesquisa_ativar_usuario
        vm.ativar_usuario = ativar_usuario
        vm.desativar_usuario = desativar_usuario
        vm.gerar_cod_ativacao_usuario = gerar_cod_ativacao_usuario
        vm.editar_usuario_permissao = editar_usuario_permissao
        vm.atualizar_permissao_user = atualizar_permissao_user
        vm.salvar_codigo = salvar_codigo
        vm.pesquisa_cod_ativacao = pesquisa_cod_ativacao
        vm.desativar_cod = desativar_cod
        vm.usuario.tema =  $localStorage.theme
        init();
        function init(){
            console.log('configAdminController')
            console.log()
            lista_permissao_user()
        }
        
        function pesquisa_ativar_usuario(params) {
            
            $http.post(`${server.api()}admin/pesquisa_user`, params).then(response=>{
                console.log(response)
                
                console.log(response.data)
                vm.result_pesquisa_ativar_usuario = response.data
                
                
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível retornar a pesquisa!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })
        } 
        function ativar_usuario(id_usuario){
            console.log('ativar_usuario')
            console.log(id_usuario)

            $http.put(`${server.api()}admin/ativar_usuario/${id_usuario}`).then(response=>{
                console.log(response)                
                swal({
                    title:'Usuário Ativado',
                    text:``,
                    icon: 'success',
                    buttons: 'OK'
                })
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível ativar o usuário!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })

        }
        function desativar_usuario(id_usuario){
            console.log('ativar_usuario')
            console.log(id_usuario)

            $http.delete(`${server.api()}admin/desativar_usuario/${id_usuario}`).then(response=>{
                console.log(response)                
                swal({
                    title:'Usuário Desativado',
                    text:``,
                    icon: 'success',
                    buttons: 'OK'
                })
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível desativar o usuário!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })

        }
        function lista_permissao_user() {
            if (!$rootScope.permissoes_user_request) {
                $http.get(`${server.api()}permissao`).then(response => {
                    if ($rootScope.permissoes_user_request != response.data) {
                        $rootScope.permissoes_user_request = response.data
                    }
                }).catch(erro => {
                    console.log(erro)
                    if (erro.status == 450) {
                        swal({
                            title: 'Permissão',
                            text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                            icon: 'warning',
                            button: 'Fechar'
                        })

                    } else {
                        swal({
                            title: 'Erro no SERVIDOR',
                            text: 'Não foi possível obter as permissões!',
                            icon: 'error',
                            button: 'Fechar'
                        })
                    }
                })
            }
        }
        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            return result;
        }
        function gerar_cod_ativacao_usuario(cod_permissao_user) {
            console.log(cod_permissao_user)
            if (typeof cod_permissao_user == 'undefined' || cod_permissao_user <= 2)
            { return }

            let iniciaNomeUser = vm.usuario.name.substring(0, 2).toUpperCase()
            let codRamdon = makeid(4).toUpperCase()
            let cod_ativacao_user = `${iniciaNomeUser}-${codRamdon}-${cod_permissao_user}`
            let element_codigo_gerado = document.getElementById('codigo_gerado')
            vm.pagina_gerar_codigo.codigo_gerado = cod_ativacao_user
            element_codigo_gerado.value = cod_ativacao_user
            console.log(cod_ativacao_user)


        }
        function editar_usuario_permissao(dados){
            
            console.log('editar_usuario_permissao')
            console.log(dados)
            vm.dados_permissao_user = dados
            
            $('#modal_editar_permissao_user').modal('show')
        }
        function atualizar_permissao_user(dados_user) {

            console.log('atualizar_permissao_user')
            console.log(dados_user)
            console.log(dados_user.cod_permissao_user)

            if (dados_user.cod_permissao_user == ''){return}
            
            $http.put(`${server.api()}atualizar_permissao/${dados_user.id}`, dados_user).then(
                response => {
                    swal({
                        title: 'Permissão alterada',
                        text: response.data,
                        icon: 'success',
                        button: 'Ok'
                    })
                }
            ).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível atualizar a PERMISSÃO!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })


        }

        function salvar_codigo(dados_codigo) {

            console.log('atualizar_permissao_user')
            console.log(dados_codigo)

            
            $http.post(`${server.api()}codigo_ativacao`, dados_codigo).then(
                response => {
                    swal({
                        title: 'Código de Ativação Salvo',
                        text: response.data,
                        icon: 'success',
                        button: 'Ok'
                    })
                }
            ).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível salvar o Código de Ativação!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })


        }
        function pesquisa_cod_ativacao(params) {
            
            $http.post(`${server.api()}admin/pesquisa_cod`, params).then(response=>{
                console.log(response)
                
                console.log(response.data)
                vm.result_pesquisa_cod_ativacao = response.data
                for (var i = 0; i < response.data.length; i++){
                    var data = toDateFormater(response.data[i].data_criacao)
                    
                    response.data[i].data_criacao = data
                    
                }
                
                
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível retornar a pesquisa!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })
        }
        function desativar_cod(id_cod){
            console.log('ativar_usuario')
            console.log(id_cod)

            $http.delete(`${server.api()}admin/desativar_cod/${id_cod}`).then(response=>{
                console.log(response)                
                swal({
                    title:'Código Desativado',
                    text:``,
                    icon: 'success',
                    buttons: 'OK'
                })
            }).catch(erro => {
                console.log(erro)
                if (erro.status == 450) {
                    swal({
                        title: 'Permissão',
                        text: `${$localStorage.usuario_logado.name}, você NÃO tem permissão de ADMINISTRADOR`,
                        icon: 'warning',
                        button: 'Fechar'
                    })

                } else {
                    swal({
                        title: 'Erro no SERVIDOR',
                        text: 'Não foi possível desativar o Código!',
                        icon: 'error',
                        button: 'Fechar'
                    })
                }
            })

        }
    }
})();