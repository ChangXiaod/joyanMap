var TableManaged = function() {

    return {
        //main function to initiate the module
        init: function() {

            if (!jQuery().dataTable) {
                return;
            }

            // begin first table
            $('#sample_1').dataTable({
                "aoColumns": [
                    {"bSortable": false},
                    null,
                    {"bSortable": false},
                    null,
                    {"bSortable": false},
                    {"bSortable": false}
                ],
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "全部"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 记录/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#sample_1 .group-checkable').change(function() {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function() {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            //jQuery('#sample_1_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

            // begin second table
            $('#sample_2').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "全部"] // change per page values here
                ],
                // set the initial value
                "bFilter": false, //不启用客户端过滤功能
                "bSort": false, //各列不具有按列排序功能
                "iDisplayLength": 5, //每页显示数据量
                "bLengthChange": false, // 用户不可改变每页显示数量
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "sProcessing": "正在加载数据...",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 记录/页",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                        "sLast": "尾页"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#sample_2 .group-checkable').change(function() {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function() {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_2_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
            jQuery('#sample_2_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            //jQuery('#sample_2_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

            // begin: third table
            $('#sample_3').dataTable({
                //"aLengthMenu": [
                //    [5, 15, 20, -1],
                //    [5, 15, 20, "全部"] // change per page values here
                // ],
                "aLengthMenu": false,
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "sProcessing": "正在加载数据...",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 记录/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#sample_3 .group-checkable').change(function() {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function() {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_3_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
            jQuery('#sample_3_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_3_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

        }

    };

}();