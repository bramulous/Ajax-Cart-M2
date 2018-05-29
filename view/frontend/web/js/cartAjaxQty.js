define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data'
], function ($, getTotalsAction, customerData) {

    $(document).ready(function(){
        console.log("Ajax Cart by BRVM running");

        var datapost = $('.cart.table-wrapper .action-delete').attr('data-post');
        var dataparsed = JSON.parse(datapost);
        var data_item = dataparsed.data;
        var uenc_value = data_item.uenc;

        // On change function for updating subtotals and quantities
        $(document).on('change', 'input[name$="[qty]"]', function(){

                var form = $($(this).closest('form'));


                $.ajax({
                    url: form.attr('action'),
                    data: form.serialize(),
                    showLoader: true,
                    success: function (res) {
                        var parsedResponse = $.parseHTML(res);
                        var result = $(parsedResponse).find("#form-validate");

                        // Replacing new subtotals per item
                        $("#form-validate").replaceWith(result);

                        // Reload totals
                        reloadTotals();

                        return false;
                    },
                    error: function (xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        console.log(err.Message);
                    }
                });

            }
        );


        // On change function for deleting ajax
        if($('#shopping-cart-table').find('tbody').length > 1) {
            $('body').on('click', '.cart.table-wrapper .action-delete', function (e) {
                e.preventDefault();


                var data_post = $(this).attr('data-post');
                var data_post_parsed = JSON.parse(data_post);
                var data_item = data_post_parsed.data;
                var data_id = data_item.id;


                var url = data_post_parsed.action;
                var data_formkey = jQuery.cookie('form_key');

                $form = $('<form id="delete-cart-item-form" action="' + url + '" method="post"><input name="id" value="' + data_id + '" >' +
                    '<input name="uenc" value="' + uenc_value + '" >' +
                    '<input name="form_key" value="' + data_formkey + '" >' +
                    '</form>');
                $form.appendTo('body');

                $.ajax({
                    type: "POST",
                    cache: false,
                    showLoader: true,
                    url: $form.attr('action'),
                    data: $form.serializeArray(),
                    success: function (data) {

                        // Replace form with updated form
                        var parsedResponse = $.parseHTML(data);
                        var result = $(parsedResponse).find("#form-validate");

                        $("#form-validate").replaceWith(result);

                        reloadTotals();
                        $('#delete-cart-item-form').remove();


                    }
                });


                return false;


            });
        }

        // Function for reloading totals and minicart
        function reloadTotals() {
            var sections = ['cart'];
            var deferred = $.Deferred();

            // Reloading the mini cart
            customerData.reload(sections, true);

            // Reloading the totals summary block
            getTotalsAction([], deferred);

        }




    });
    return false;
});