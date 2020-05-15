
// store easy, medium , advanced
let easy_level = 10;
let medium_level = 25;
let advanced_level = 50;
const field_storage_level = 'selected_level';

if (localStorage.getItem(field_storage_level)==null || localStorage.getItem(field_storage_level)== undefined){
    localStorage.setItem(field_storage_level,easy_level)
    level_selected = easy_level;
    setTitle(easy_level)
}else{
    level_selected = localStorage.getItem(field_storage_level);
    setTitle(level_selected)
}

let $word_auto = [];
let $index_array = 0;

// store the true word & false word
let $true_word = [];
let $false_word = [];

// store stopwatch
let $stopwatch_start = false;

let $kata = new Vue({
    el : '#kata',
    data : {
        word_to_display : '',
        loading : true,
        level : null,
        count_word : 0,
        data_level : [
            {
                level : 'Easy',
                value : easy_level,
                id : 'select_easy'
            },
            {
                level : 'Medium',
                value : medium_level,
                id : 'select_medium'
            },
            {
                level : 'Advanced',
                value : advanced_level,
                id : 'select_advanced'
            }
        ]
    },
    methods : {
        selectLevel: function(e){
            localStorage.setItem(field_storage_level, this.level)
            user_input.reload()
        },
        loadWord(){
           jnet({
               url : API_Random_Word+level_selected
           }).request($response=>{
               let $obj = JSON.parse($response);
               
               // insert div to word, so we can mark the word
               let $obj_modif = '';
               for(let i = 0; i< $obj.length; i++){
                   let element_word = `<word id="word_${i}">${$obj[i]}</word> `;
                   $obj_modif += element_word;
               }

               this.word_to_display = $obj_modif

               this.loading = false;
               $word_auto = $obj;
               
               user_input.readonly=false
               user_input.focusTextArea()

               this.count_word = $word_auto.length;
           })
        }
    },
    mounted(){
        this.loadWord();
    }
})

let user_input = new Vue({
    el : '#user_input',
    data : {
        user_text : null,
        true_point: 0,
        false_point : 0,
        data_true_false_word : [],
        readonly : true,
        stopwatch : '00:00',
        interval_obj : null,
        minute:0,
        second :0 ,
        result_score : 0,
        average_score : 0
    },
    methods: {
        runStopWatch: function(){
            this.interval_obj = setInterval(() => {
               
                if (this.second==60){
                    this.minute++;
                    this.second = 0;
                }else{
                    this.second++;
                }

                this.stopwatch = this.minute + ':'+this.second;

                if ($index_array==$word_auto.length){
                    this.stopStopWatch();
                }
            }, 1000);
        },
        stopStopWatch:function(){
            this.menit = 0;
            this.detik = 0;
            this.user_input = null;
            this.readonly = true;
            clearInterval(this.interval_obj);
            showAlert()
            this.calculateResult();
        },
        calculateResult: function(){
           
            let minute = this.minute * 60;
            let second = this.second;

            let sum = minute + second;

            let average = 0;

            if ($true_word.length==0){
                
            }else{
                average = sum / $true_word.length;
            }

            this.average_score = Math.floor(average)+' word / second';
            this.result_score = $true_word.length+' words in '+sum + ' second';
        }
        ,
        detectTyping: function(e){
            try{
                // find element of word
                document.getElementById('word_'+$index_array).style.color = "#DC7633";
            
                if ($index_array==$word_auto.length){
                    this.stopStopWatch();
                    return;
                }

                if ($stopwatch_start==false){
                    $stopwatch_start = true;
                    this.runStopWatch()
                }
                
                $kata_will_be_compare = $word_auto[$index_array];

                if (e.key===' ' && this.user_text.trim() === ''){
                    return;
                }else{
                    if ($kata_will_be_compare===this.user_text.trim()){
                    
                        if (e.key===' ' || e.key==='Enter'){
                            $true_word.push(this.user_text)
                            this.runTable(this.user_text,true)
                            this.runScoreTrueFalse()
                            document.getElementById('word_'+$index_array).style.color = "#00b894";
                            $index_array++;
                            this.user_text=null
                        }
        
                    }else if(e.key===' ' || e.key==='Enter'){
                        $false_word.push(this.user_text)
                        this.runTable(this.user_text,false)
                        this.runScoreTrueFalse()
        
                        $index_array++;
                        this.user_text=null
                    }
                }
            }catch(e){
                console.log('Typing Speed Test - '+e);
            }
        },
        runTable: function(word=null,type=null){
            if (type==true){
                this.data_true_false_word.push({
                    true : word,
                    false : ''
                })
            }else if (type==false){
                this.data_true_false_word.push({
                    false : word,
                    true : ''
                })
            }
        },
        runScoreTrueFalse(){
            this.true_point = $true_word.length
            this.false_point = $false_word.length
        }
        ,
        reload(){
           window.location.href = 'index.html';
        },
        focusTextArea(){
            this.$refs.user_text.focus()
        }
    }
})

function showAlert(){
    Swal.fire({
        title: 'Time is Over',
        text: 'Check the result',
        icon: 'success',
        confirmButtonText: 'OK'
    })
}


function setTitle(level){
    if (level==10){
        level = 'Easy'
    }else if (level ==25){
        level = 'Medium'
    }
    else if (level == 50){
        level = 'Advanced'
    }
    document.title = `Level ${level.toUpperCase()} | Typing-Speed-Test `
}


function showInfo(){
    Swal.fire({
        title: 'How to use ?',
        text: 'Press enter or space for confirmation your word.',
        icon: 'info',
        confirmButtonText: 'OK'
    })
}