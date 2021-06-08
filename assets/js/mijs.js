
$(document).ready(function(){
    var usuariosTable = $('#usuarios_data').bootgrid({

        ajax:true,
        rowSelect: true,
        url: base_url + 'bootgrid/fetch_data',
        formatters:{
            "commands":function(column, row)
            {
                return "<button type='button' class='btn btn-warning btn-xs update' data-row-id='"+row.id+"'>Edit</button>" + "&nbsp; <button type='button' class='btn btn-danger btn-xs delete' data-row-id='"+row.id+"'>Delete</button>";
            }
        }
    });
    
    $('#add_button').click(function(){
        $('#usuarios_form')[0].reset();
        $('.modal-title').text("Add Usuario");
        $('#action').val("Add");
        $('#operation').val("Add");
    });

    $(document).on('submit', '#usuarios_form', function(event){
        event.preventDefault();
        var nombre = $('#nombre').val();
        var apellido = $('#apellido').val();
        var email = $('#email').val();
        var usuario = $('#usuario').val();
        var password = $('#password').val();
        var perfil = $('#perfil').val(); 
        var form_data = $(this).serialize();
        if(nombre != '' && apellido != '' &&  email != '' &&  usuario != '' &&  password != '' &&  perfil != '')
        {
            $.ajax({
                url:base_url + 'bootgrid/action',
                method:"POST",
                data:form_data,
                success:function(data)
                {
                    alert(data);
                    $('#usuarios_form')[0].reset();
                    $('#usuariosModal').modal('hide');
                    $('#usuarios_data').bootgrid('reload');
                }
            });
        }
        else
        {
            alert("All Fields are Required");
        }
    });

    $(document).on("loaded.rs.jquery.bootgrid", function(){
        usuariosTable.find('.update').on('click', function(event){
            var id = $(this).data('row-id');
            $.ajax({
                url:base_url + 'bootgrid/fetch_single_data',
                method:"POST",
                data:{id:id},
                dataType:"json",
                success:function(data)
                {
                    $('#usuariosModal').modal('show');
                    $('#nombre').val(data.nombre);
                    $('#apellido').val(data.apellido);
                    $('#email').val(data.email);
                    $('#usuario').val(data.usuario);
                    $('#password').val(data.password);
                    $('#perfil').val(data.perfil);
                    $('.modal-title').text("Editar Usuarios");
                    $('#usuario_id').val(id);
                    $('#action').val('Edit');
                    $('#operation').val('Edit');
                }
            });
        });
        
        
        usuariosTable.find('.delete').on('click', function(event){
            if(confirm("Are you sure you want to delete this?"))
            {
                var id = $(this).data('row-id');
                $.ajax({
                    url:base_url + 'bootgrid/delete_data',
                    method:"POST",
                    data:{id:id},
                    success:function(data)
                    {
                        alert(data);
                        $('#usuarios_data').bootgrid('reload');
                    }
                });
            }
            else
            {
                return false;
            }
        });
    });

/* Implemento free-jqgrid par productosv2. */
    var urlImg = base_url + "assets/img/productos/";
    var tablaProuctos = $("#product_data").DataTable({
        
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            language: {
                "url":"https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
              },
            select:true,
            "pagingType": "full_numbers",
            select:{
               style:'multi'
            },
            
            ajax:{
                url: base_url + 'productos/fetch_data',
                'beforeSend': function (request) {
                    request.setRequestHeader("Authorization","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
                    request.setRequestHeader("Subscription-Key","1d64412357444dc4abc5fe0c95ead172");
                } ,
                data: {
                        'baja' : function(){
                            return $('#baja').prop('checked');
                        },
                    },
                type: 'POST',
                cache: false, // It will not use cache url
                dataSrc: "rows"
            },
            
            columns: [
                { "data": "id"},
                { "data": "descripcion"},
                { "data": "cat_id"},
                { "data": "price"},
                { "data": "image",
                  "render": function(data, type, row){
                      return '<img src="'+ urlImg + data +'" height="75" width="75"/>';
                    }},

                {"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary btn-sm btnEditar'><i class='material-icons'>edit</i></button><button class='btn btn-danger btn-sm btnBorrar'><i class='material-icons'>delete</i></button></div></div>"}
                
                               
            ],
            "scrollY":        "340px",
            "scrollCollapse": true,
            Destroy: true,
            
            
    });

    

    var fila;
    $('#produc_form').submit(function(e){
        e.preventDefault();
        descripcion = $("#descripcion").val();
        cat = $("#cat").val();
        price = $("#price").val();
        if (descripcion!="" && cat != "" && price != "") {
            if (parseInt(price, 10) >=0) {
                $.ajax({
                    url: base_url + 'productos/action',
                    type:"POST",
                    data:new FormData(this),
                    processData: false,
                    contentType: false,
                    success: function(data){
                        $("#producModal").modal('hide');
                        tablaProuctos.ajax.reload(null, null);
                        alert(data.response);
                    }
                });     
            } else {
                alert("El Monto debe ser o igual a 0");
            }                       
        } else {
            alert("todos los compos son necesarios");
        }
        
    });

    $(document).on("click", "#add_buttonP", function(e){
        e.preventDefault();
        //determino la operacion, blanqueola imagen, blanqueo los campos
        $("#produc_form").trigger("reset")
        $('.modal-title').text("Add Producto");
        $('#operation').val("Add");
        $('#action').val("Add");
        $("#descripcion").val();
        $("#cat").val();
        $("#gender").val();
        $("#price").val();
        $('#output').attr(src, '');
        $('#producModal').modal("show");
    });


    //Editar
    $(document).on("click", ".btnEditar", function(){		        
        $('#operation').val('Edit');//editar
        fila = $(this).closest("tr");	        
        id = parseInt(fila.find('td:eq(0)').text()); //capturo el ID		            
        descripcion = fila.find('td:eq(1)').text();
        cat = fila.find('td:eq(2)').text();
        price = fila.find('td:eq(3)').text();
        image = fila.find('td:eq(4)').text();
        $("#descripcion").val(descripcion);
        $("#cat").val(cat);
        $("#gender").val(cat);
        $("#price").val(price);
        $("#output").attr("src", base_url + "assets/img/productos/" + image);
        $('.modal-title').text("Editar Producto");
        $('#id').val(id);
        $('#action').val('Edit');
        $('#operation').val('Edit');   
        $('#producModal').modal("show");
    });


    //Borrar
    $(document).on("click", ".btnBorrar", function(){		        
        fila = $(this);
        id = parseInt($(this).closest('tr').find('td:eq(0)').text()); //capturo el ID		            
        descripcion = $(this).closest('tr').find('td:eq(1)').text();
        var respuesta = confirm("Elminará el pruducto " + descripcion + "?");
        if (respuesta) {
            $.ajax({
                url:base_url + 'productos/delete_data',
                method:"POST",
                data:{id:id},
                success:function(data){
                    tablaProuctos.row(fila.parents('tr')).remove().draw();
                }
            })
        }
    });

    //click chekbox
    $('#baja').on('click', function(event){
        tablaProuctos.ajax.reload(null, false);
    })
      
    

    //
    //Grid de Productos no funciona con bsp 4
    //
   
    /* var productTable = $('#product_data').bootgrid({
    ajax:true,
    requestHandler: function (request) {
        //Add your id property or anything else
        request.baja = $('#baja').prop("checked");
        request.id = "b0df282a-0d67-40e5-8558-c9e93b7befed";
        return request;
    },
    
    post: function ()
    {
         To accumulate custom parameter with the request object 
        return {
            id: "b0df282a-0d67-40e5-8558-c9e93b7befed"
        };
    },
    rowSelect: true,
    padding: 5,
    url: base_url + 'productos/fetch_data',
    formatters:{
        "image":function(column, row){
                return "<img class='table-img' src='" + base_url + "assets/img/productos/" + row.image + "'width='100' height='100'   />";
            },
        "commands":function(column, row){
            return "<button type='button' class='btn btn-warning btn-xs update' data-row-id='"+row.id+"'>Edit</button>" + "&nbsp; <button type='button' class='btn btn-danger btn-xs delete' data-row-id='"+row.id+"'>Delete</button>";
        }
        }
    });
    
    $('#add_button').click(function(){
        $('#produc_form')[0].reset();
        $('.modal-title').text("Add Producto");
        $('#action').val("Add");
        $('#operation').val("Add");
    });

    
    $('#close').click(function(){
        $('#produc_form')[0].reset();
        $('#output').attr("src", '');
        $('.modal-title').text("Add Producto");
        $('#action').val("Add");
        $('#operation').val("Add");
    });

    al apretar en el boton add del modal envia el form via ajax al controlador
    el cual actua segun la accion a tomar, editando o agregando un producto
    $(document).on('submit', '#produc_form', function(event){
        event.preventDefault();
        var descripcion = $('#descripcion').val();
        var cat = $('#cat').val();
        var image = $('#output').attr("src");
        var price = $('#price').val();
        if(descripcion != '' && cat != '' &&   price != '' && image !='' )
        {
            $.ajax({
                url: base_url + 'productos/action',
                type: "post",
                data: new FormData(this),
                processData: false,
                contentType: false,
                cache: false,
                //async:false,
                success: function(data){
                    $('#produc_form')[0].reset();
                    $('#producModal').modal('hide');
                    $('#product_data').bootgrid('reload');
                    
                }
            });
                
        }else{
            alert("All Fields are Required");
        }
        
    });

    Al hacer click en el boton edit busca el id en la base y carga los datos en el modal
    hacer algo similar al hacer click en el check
    $(document).on("loaded.rs.jquery.bootgrid", function(){
        $('#baja').on('click', function(event){
            $('#product_data').bootgrid('reload');
        })       
    });

    $(document).on("loaded.rs.jquery.bootgrid", function(){
        productTable.find('.update').on('click', function(event){
            var id = $(this).data('row-id');
            $.ajax({
                url:base_url + 'productos/fetch_single_data',
                method:"POST",
                data:{id:id},
                dataType:"json",
                success:function(data)
                {
                    $('#producModal').modal('show');
                    $('#descripcion').val(data.descripcion);
                    $('#cat').val(data.cat_id);
                    $('#price').val(data.price);
                    //se muestra la img en el modal
                    $('#output').attr("src", base_url + "assets/img/productos/" + data.image);
                    $('.modal-title').text("Editar Producto");
                    $('#id').val(id);
                    $('#action').val('Edit');
                    $('#operation').val('Edit');
                }
            });
        });
        
        
        productTable.find('.delete').on('click', function(event){
            if(confirm("Está Usted Seguro de Eliniar el producto?"))
            {
                var id = $(this).data('row-id');
                $.ajax({
                    url:base_url + 'productos/delete_data',
                    method:"POST",
                    data:{id:id},
                    success:function(data)
                    {
                        alert(data);
                        $('#product_data').bootgrid('reload');
                    }
                });
            }
            else
            {
                return false;
            }
        });
    });
    fin grid productos */

    //script para visualizar la imagen que se selecciona en el modal de productos
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    
    if (window.FileList && window.File && window.FileReader) {
      document.getElementById('image').addEventListener('change', event => {
        output.src = '';
        status.textContent = '';
        const file = event.target.files[0];
        if (!file.type) {
          status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
          return;
        }
        if (!file.type.match('image.*')) {
          status.textContent = 'Error: The selected file does not appear to be an image.'
          return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', event => {
          output.src = event.target.result;
        });
        reader.readAsDataURL(file);
        
      }); 
    }
    
});
