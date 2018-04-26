define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data'
], function ($, getTotalsAction, customerData) {

    $(document).ready(function(){
        console.log("running");


        // On change function for updating totals
        $(document).on('change', 'input[name$="[qty]"]', function(){
                console.log("quantity changed");
                var form = $($(this).closest('form'));

                $.ajax({
                    url: form.attr('action'),
                    data: form.serialize(),
                    showLoader: true,
                    success: function (res) {
                        var parsedResponse = $.parseHTML(res);
                        var result = $(parsedResponse).find("#form-validate");
                        var sections = ['cart'];

                        // Replacing new subtotals per item
                        $("#form-validate").replaceWith(result);

                        // Reloading the mini cart
                        customerData.reload(sections, true);

                        // Reloading the totals summary block
                        var deferred = $.Deferred();
                        getTotalsAction([], deferred);

                        console.log('Ajax succes function completed');

                    },
                    error: function (xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        console.log(err.Message);
                    }
                });

            }
        );



    });
});