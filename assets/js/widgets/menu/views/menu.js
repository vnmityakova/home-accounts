define(['backbone', 'text!../templates/menu.html'],
    function( Backbone, tpl ) {
        var MenuView = Backbone.View.extend({

            template: _.template(tpl),

            events : {
                'click li': 'highlightCurrentOnClick'
            },

            initialize: function(options) {
                this.render();
                /*Backbone.Events.on('pageChanged', function( args ) {
                });*/
            },

            render: function() {
                this.$el.empty().append( this.template() );
                this.highlightCurrent();
                return this;
            },

            highlightCurrent: function(){
                var $menuItems = $("[data-eid=menu-block] ul li");
                $menuItems.removeClass("current");

                $menuItems.each(function( index ) {
                    var curItemLink = $(this).find('a').attr('href');
                    if( window.location.hash == curItemLink ) {
                        $( this ).addClass("current");
                    }
                });
            },

            highlightCurrentOnClick : function(e){
                var $menuItems = $("[data-eid=menu-block] ul li");
                $menuItems.removeClass("current");
                if(e) $(e.target).parent().addClass("current");
            }

        });

        return MenuView;

    });