define(['backbone', 'text!../templates/currentIncomings.html', '../../incomings/collections/collection',
        'chartJs', '../chartData', '../../utils'],
    function( Backbone, tpl, IncomingsCollection, ChartJs, ChartData, Utils ) {
        var CurrentIncomings = Backbone.View.extend({

            template: _.template(tpl),

            events : { },

            initialize: function(options) {
                var self=this;

                Backbone.Events.once('current-page-appended', function(){
                    self.renderChart();
                });
            },

            render: function() {
                var self = this;
                this.$el.empty().append( this.template(/*{
                 data: this.model
                 }*/) );
                this.$("[data-eid=last-month-dates]").text( this.getDatesPeriod() );

                this.chartData = new ChartData();

                return this;
            },

            getDatesPeriod : function(){
                var today = new Date();
                var curDate = $.datepicker.formatDate("dd.mm.yy", today);
                var monthAgoDate = new Date( today.setMonth(today.getMonth() - 1) );
                var monthAgoDateStr = $.datepicker.formatDate("dd.mm.yy", monthAgoDate);
                return monthAgoDateStr + " - " + curDate;
            },

            renderChart: function () {
                var self = this;
                var summary = 0;
                this.incomingsCollection = new IncomingsCollection();

                this.collection.each(function (model) {
                    var modelJson = model.toJSON();
                    self.chartData.add(+modelJson.incomingAmmount, modelJson.categoryId, modelJson.categoryName);
                    summary += +modelJson.incomingAmmount;
                });
                self.drawChart(self.chartData);
                this.$("[data-eid=summary-incomings]").append(Utils.addSpacesToSum(summary) + " руб.");

            },

            drawChart : function(){
                var data = this.chartData.getChartData();

                // For a pie chart
                var ctx =  this.$("[data-eid=chart-incomings]").get(0).getContext("2d");
                var myPieChart = new Chart(ctx).Pie(data, {
                    animationEasing: "linear",
                    animationSteps: 20,
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%=value+' руб.'%>"
                });
                var legend = myPieChart.generateLegend();
                this.$("[data-eid=add-legend]").empty().append(legend);
            }

        });

        return CurrentIncomings;

    });