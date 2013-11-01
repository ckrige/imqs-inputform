
// global namespace
iq = window.iq || {};

// This function runs once, after document load
iq.postDocLoad = function() {




    // set up DOM skeleton
    iq.addDomElements();
    iq.resizeDomElements();


    //INPUT FORM
    var inputform = new iq.inputform.Control("content",true,"Fields marked by * are required.","SOME REQUIRED FIELDS HAVE NOT BEEN COMPLETED. FIELDS MARKED BY * ARE REQUIRED.") ;

    inputform.fields.push(new iq.inputform.Field(true,true,"Project Number:",iq.inputform.FieldType.TEXT,1,"Project",["PR7465"],{"placeholder":"Unique Project Number"}));
    inputform.fields.push(new iq.inputform.Field(false,false,"Recurring Project:",iq.inputform.FieldType.CHECKBOX,2,"Project",["checked"],{"placeholder":"Unique Project Number"}));
    inputform.fields.push(new iq.inputform.Field(true,true,"Project Name:",iq.inputform.FieldType.TEXT,3,"Project",[],{"placeholder":"Project Name"}));
    inputform.fields.push(new iq.inputform.Field(true,true,"Start Date:",iq.inputform.FieldType.DATETIME,4,"Project",["2013-02-11"],{}));
    inputform.fields.push(new iq.inputform.Field(true,false,"Main Contractor:",iq.inputform.FieldType.TEXT,5,"Project",[],{}));
    inputform.fields.push(new iq.inputform.Field(true,true,"End Date:",iq.inputform.FieldType.DATETIME,6,"Project",[],{}));
    inputform.fields.push(new iq.inputform.Field(true,false,"Consultant:",iq.inputform.FieldType.TEXT,7,"Project",[],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Full Project Description:",iq.inputform.FieldType.TEXTAREA,8,"Project",[],{}));


    inputform.fields.push(new iq.inputform.Field(false,true,"Project Outputs:",iq.inputform.FieldType.TEXTAREA,1,"Outputs & Comments",["This project is aimed at spending a lot of money on some stuff."],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Project Comments:",iq.inputform.FieldType.TEXTAREA,2,"Outputs & Comments",[],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Reason for Deviation:",iq.inputform.FieldType.TEXTAREA,3,"Outputs & Comments",[],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Corrective Measure:",iq.inputform.FieldType.TEXTAREA,4,"Outputs & Comments",[],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Risk:",iq.inputform.FieldType.TEXTAREA,5,"Outputs & Comments",[],{}));
    inputform.fields.push(new iq.inputform.Field(false,true,"Mitigation:",iq.inputform.FieldType.TEXTAREA,6,"Outputs & Comments",[],{}));

    inputform.fields.push(new iq.inputform.Field(false,true,"Departmental Objective",iq.inputform.FieldType.SELECT,1,"Project Attributes",["option 2"],{"options":["option 1","option 2"]}));
    inputform.fields.push(new iq.inputform.Field(false,true,"GDS Focus Area",iq.inputform.FieldType.SELECT,2,"Project Attributes",[],{"options":["option 1","option 2"]}));
    inputform.fields.push(new iq.inputform.Field(false,true,"GDS Landscape",iq.inputform.FieldType.SELECT,3,"Project Attributes",[],{"options":["option 1","option 2"]}));



    inputform.fields.push(new iq.inputform.Field(false,true,"Field 1",iq.inputform.FieldType.LABEL,1,"Budget",[],{"placeholder":"fill in field 1 details here"}));


    inputform.fields.push(new iq.inputform.Field(false,true,"Link CCC to project",iq.inputform.FieldType.CHECKLIST,1,"CCA & Ward",["ccc 1","ccc 2"],{"options":["ccc 1","ccc 2"]}));
    inputform.fields.push(new iq.inputform.Field(true,false,"Link Ward to project",iq.inputform.FieldType.CHECKLIST,1,"CCA & Ward",["ward 2"],{"options":["ward 1","ward 2","ward 3","ward 4","ward 5"]}));

    inputform.show();

    $( window ).resize(function() {
        iq.resizeDomElements();
        inputform.show();
    });


};

iq.resizeDomElements = function() {
    var dims = iq.windowDimensions();
    var contentHeight = dims.height - 100;

    $('#top').outerHeight( 58 );
    $('#top').outerWidth( dims.width -10 );

    $('#content').outerHeight( contentHeight -58 );
    $('#content').outerWidth( dims.width -10);


};

iq.addDomElements = function() {
    $('body').empty();
    var content = '<div id="top" style="background-color: #efefef; border-bottom: 1px solid #E1E1E1">Dynamic Form Test</div>';
    content +=    '<div id="content" ></div>'

    $('body').append(content);
};

iq.windowDimensions = function() {
    var w = 630, h = 460;
    if (document.body && document.body.offsetWidth) {
        w = document.body.offsetWidth;
        h = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
        w = document.documentElement.offsetWidth;
        h = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        w = window.innerWidth;
        h = window.innerHeight;
    }
    return {width: w, height: h};
};