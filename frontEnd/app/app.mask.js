(function(){
    $(function() {
        $.mask.definitions['~'] = "[+-]";
        $(".maskCpf").mask("999.999.999-99");
        $(".maskData").mask("99/99/9999");
        $(".maskTelefone").mask("(99) 9999 - 9999");
        $(".maskSei").mask("99999.999999/9999-99");
        $(".maskCnpj").mask("99.999.999/9999-99");
        $(".maskCoodX").mask("999999,99");
        $(".maskCoodY").mask("9999999,99");
    });
})();