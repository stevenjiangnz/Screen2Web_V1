/**
 * Created by steven on 24/02/2016.
 */
(function () {
    angular.module('screenApp')
        .constant('appSettings', {
                'name': 'Screen2',
                'baseServiceUrl': 'http://localhost:8002',
                'localRepositoryKeyPrefix': 'Screen2.',
                'stockDefaultStartDate': 20130000,
                'stockDefaultWindow': 60000,
                'stockDefaultAnalysisDate': 19950000,
                'indicatorSettings': {
                    'sma5': {
                        'parameter': 'sma,5',
                        'ownPane': false,
                        'color': '#aaa'
                    },
                    'sma10': {
                        'parameter': 'sma,10',
                        'ownPane': false,
                        'color': '#FFD455'
                    },
                    'sma30': {
                        'parameter': 'sma,30',
                        'ownPane': false,
                        'color': '#61B60C'
                    },
                    'sma50': {
                        'parameter': 'sma,50',
                        'color': '#00FF00',
                        'ownPane': false
                    },
                    'sma200': {
                        'parameter': 'sma,200',
                        'ownPane': false,
                        'color': '#0FE4E4'
                    },
                    'ema10': {
                        'parameter': 'ema,10',
                        'ownPane': false,
                        'color': '#AE2EAE'
                    },
                    'ema20': {
                        'parameter': 'ema,20',
                        'ownPane': false,
                        'color': '#FF0055'
                    },
                    'bb': {
                        'parameter': 'bb,20,2.5',
                        'ownPane': false,
                        'color': '#ffffff'
                    },
                    'closemain': {
                        'parameter': "closemain",
                        'color': '#FFFF55',
                        'ownPane': false
                    },
                    'macd': {
                        'parameter': 'macd',
                        'ownPane': true,
                        'color': '#55D4FF',
                        'height': 120
                    },
                    'rsi': {
                        'parameter': 'rsi,6',
                        'ownPane': true,
                        'color': '#7F2AFF',
                        'colorRsi': '#AAFFFF',
                        'height': 100
                    },
                    'adx': {
                        'parameter': 'adx',
                        'ownPane': true,
                        'color': '#FF55AA',
                        'colorAdx': '#FFFFFF',
                        'colorDiPlus': '#2AFF2A',
                        'colorDiMinus': '#FF55D4',
                        'height': 180
                    },
                    'macd': {
                        'parameter': 'macd,26,12,9',
                        'ownPane': true,
                        'color': '#FF55AA',
                        'colorMacd': '#2AFF2A',
                        'colorSignal': '#FF55D4',
                        'colorHist': '#E1E1E1',
                        'height': 150
                    },
                    'heikin': {
                        'parameter': 'heikin',
                        'ownPane': true,
                        'color': '#AAAAFF',
                        'height': 150
                    },
                    'stochastic': {
                        'parameter': 'stochastic,14,3',
                        'ownPane': true,
                        'color': '#FFAA00',
                        'colorK': '#2AFF2A',
                        'colorD': '#FF55D4',
                        'height': 120,
                        'threshold1': 30,
                        'threshold2': 70
                    },
                    'william': {
                        'parameter': 'william,14',
                        'ownPane': true,
                        'color': '#AAFF2A',
                        'colorWilliam': '#FFFF2A',
                        'height': 100,
                        'threshold1': -20,
                        'threshold2': -80
                    }
                },
                'zoneKey': 'currentZone',
                'accountKey': 'currentAccount',
                'editorSettings': {
                    setup : function(ed)
                    {
                        ed.on('init', function()
                        {
                            this.getDoc().body.style.fontSize = '15px';
                            this.getDoc().body.style.fontWeight = '600';
                        });
                    },
                    selector: 'textarea',
                    height: 500,
                    theme: 'modern',
                    image_advtab: true,
                    paste_data_images: true,

                    plugins: [
                        "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                        "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                    ],

                    toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                    toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
                    toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",

                    menubar: false,
                    toolbar_items_size: 'small',

                    style_formats: [{
                        title: 'Bold text',
                        inline: 'b'
                    }, {
                        title: 'Red text',
                        inline: 'span',
                        styles: {
                            color: '#ff0000'
                        }
                    }, {
                        title: 'Red header',
                        block: 'h1',
                        styles: {
                            color: '#ff0000'
                        }
                    }, {
                        title: 'Example 1',
                        inline: 'span',
                        classes: 'example1'
                    }, {
                        title: 'Example 2',
                        inline: 'span',
                        classes: 'example2'
                    }, {
                        title: 'Table styles'
                    }, {
                        title: 'Table row 1',
                        selector: 'tr',
                        classes: 'tablerow1'
                    }],

                    templates: [{
                        title: 'Test template 1',
                        content: 'Test 1'
                    }, {
                        title: 'Test template 2',
                        content: 'Test 2'
                    }]
                }
            }
        ).value('sessionState', {});

})();
