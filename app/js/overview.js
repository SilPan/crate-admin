define(['jquery',
        'underscore',
        'backbone',
        'base',
        'text!views/overview.html',
        'bootstrap'
    ], function ($, _, Backbone, base, OverviewTemplate) {

    var Overview = {};

    Overview.OverviewView = base.CrateView.extend({

        id: 'page-wrapper',
        template: _.template(OverviewTemplate),

        initialize: function () {
            // this.listenTo(this.model, 'change:loadHistory', this.updateLoadGraph);
            this.listenTo(this.model, 'change', this.render);
        },

        replicatedStatusClass: function () {
            if (this.model.get('records_underreplicated') > 0){
                return "panel-warning";
            }
            return "";
        },

        availableDataClass: function () {
            if (this.model.get('records_unavailable') > 0){
                return "panel-danger";
            }
            return "";
        },

        updateLoadGraph: function (loadHistory) {
            var i, lh, data=[];

            lh = this.model.get('loadHistory')[0];
            for (i=0; i<lh.length; i++) {
                data.push([i, lh[i]]);
            }

            $.plot(this.$('#load-graph'), [{label: 'cluster load', data: data, color: '#676767'}], {

                series: {
                    shadowSize: 0,
                    points: { show: true }
                },
                lines: { show: true, fill: true },
                yaxis: {
                    min: 0,
                },
                xaxis: {
                    min: 0,
                    max: 100,
                    show: false
                },
            }).draw();
        },

        render: function () {
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));
            _.defer(function () { self.updateLoadGraph(); });

            return this;
        }
    });

    return Overview;
});
