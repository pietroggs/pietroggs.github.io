function TutorExtensionEYC(){    
    this.getName = function(){
        return "TutorExtensionEYC";
    }
    this.getType = function() { 
        return "EXTENSION_TUTOR";
    }
     
    this.getTutorId = function() { 
        return "tutor1";
    }
     
    this.getTutorConfig = function() { 
        return {
            "tutors": [
                {
                    "name": "tutor_tucan",
                    "fps": 20,
                    "width": 200,
                    "height": 250,
					"interactive": true,
                    "avatar": "_avatar.png"
                },
            ],
            "actions": [
                {
                    "type": "DEFAULT",
                    "commands": [
                        {
                            "type": "IMAGE",
                            "asset": "_static.png"
                        }
                    ]
                },
                {
                    "type": "ON_OK",
                    "commands": [
                        {
                            "type": "ANIMATION",
                            "asset": "_ok.png"
                        },
                        {
                            "type": "SOUND",
                            "asset": "_ok.mp3"
                        }
                    ],
                    "params": {}
                },
				{
                    "type": "ON_WRONG",
                    "commands": [
                        {
                            "type": "ANIMATION",
                            "asset": "_wrong.png"
                        },
                        {
                            "type": "SOUND",
                            "asset": "_wrong.mp3"
                        }
                    ],
                    "params": {}
                },
				{
                    "type": "ON_PAGE_ALL_OK",
                    "commands": [
                        {
                            "type": "ANIMATION",
                            "asset": "_allok.png"
                        },
                        {
                            "type": "SOUND",
                            "asset": "_allok.mp3"
                        }
                    ],
                    "params": {}
                }
            ]
        };
    }
}
function TutorExtensionEYCCreator(){
    this.create = function(){
        return new TutorExtensionEYC();
    }
}
if (typeof empiriaOnExtensionLoaded == 'function'){
    empiriaOnExtensionLoaded(new TutorExtensionEYCCreator());
}