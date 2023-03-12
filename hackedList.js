/*CLEAN DATA V1*/
"use strict";
//OBJECTS
const Student = {
  firstName: "",
  lastName: "",
  middleName: "undefined",
  nickName: "null",
  house: "",
  //added properties to student object
  isSquadMember: false,
  expelled: false,
};

//filter dropdown menu
const filterActive = document.querySelector("#filtering");

//sorting dropdown menu  var
const sortingActive = document.querySelector("#sorting");
//search field
const searchValue = document.querySelector("#search");

//all List arrays
let allStudents = [];
//find another more generic way to see/set/get the prefects!!
const gryfPrefectArray = [];
const slytPrefectArray = [];
const huffPrefectArray = [];
const ravePrefectArray = [];
let squadArray = [];
let expelledArray = [];
let flag = false;
// global var;
let template = document.querySelector("#ListDisplay .FilteredStudentList");
//houses
let filteredStudentsList;

window.addEventListener("DOMContentLoaded", start);

function start() {
  loadJSON();
  document.querySelector(".StudentHeadline").classList.add("hide");
  document.querySelector("#ListDisplay").classList.add("hide");
}

async function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

//BLOODSTATUS LIST
async function getBloodStatus() {
  const blooddata = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  const bloodstatus = await blooddata.json();
  setBloodStatus(bloodstatus);
}
//get field value for filter and sort
//sort on cases which corresponds to sort field value using localeCompare(), e.g. sort alphabetically;
//return that to the filter function in order to filter allStudents array correctly, based on filter field value.
function getFilterSortSearchValues() {
  return allStudents
    .filter(
      (
        s //filter after the student filter dropdown property
      ) =>
        (s.house === filterActive.value ||
          (s.prefect && filterActive.value === "Prefects") ||
          (s.isSquadMember && filterActive.value === "Inquisitor Squad") ||
          (s.expelled && filterActive.value === "Expelled")) &&
        //filter after searchfield - searching across searchValue and compare to the students names
        (s.firstName + " " + s.lastName).includes(searchValue.value)
    ) //SORTING
    .sort((s1, s2) => {
      //expr in switch statement is the thing i want to check
      switch (sortingActive.value) {
        //expr in case statement is the string i want to check against.
        case "Firstname":
          return s1.firstName.localeCompare(s2.firstName);
        case "Lastname":
          return s1.lastName.localeCompare(s2.lastName);
        default:
          0;
      }
    });
}

//Eventlistener for FILTERING dropdown menu activate

//add eventlistener for when a filter has been changed
filterActive.addEventListener("change", () => {
  //if filter is inq. squad
  if (filterActive.value === "Inquisitor Squad") {
    displayList(squadArray);
  }
  if (filterActive.value === "Expelled") {
    displayList(expelledArray);
  } else {
    displayList(getFilterSortSearchValues());
  }
});

//Eventlistener for SORTING dropdown menu activate
sortingActive.addEventListener("change", () =>
  displayList(getFilterSortSearchValues())
);

searchValue.addEventListener("input", () =>
  displayList(getFilterSortSearchValues())
);

//eventlisteners for clicking on 4 house banners

document.querySelector("#GhouseCrest").onclick = function () {
  filterActive.value = "Gryffindor";
  displayList(getFilterSortSearchValues());
};
document.querySelector("#ShouseCrest").onclick = function () {
  filterActive.value = "Slytherin";
  displayList(getFilterSortSearchValues());
};
document.querySelector("#HhouseCrest").onclick = function () {
  filterActive.value = "Hufflepuff";
  displayList(getFilterSortSearchValues());
};
document.querySelector("#RhouseCrest").onclick = function () {
  filterActive.value = "Ravenclaw";
  displayList(getFilterSortSearchValues());
};
function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    //create new instance of student
    const student = Object.create(Student);
    //store the fullname property with no spaces before or after string
    let fullnameString = jsonObject.fullname;

    //get values from fullnameString (json data) to populate the student properties

    let result = "";

    // STUDENTS FIRSTNAME
    //temporary var to store trimmed or not trimmed first name
    let trimmedString1 = fullnameString.trimStart();
    result = trimmedString1.substring(0, trimmedString1.indexOf(" "));
    //special case of one, find a better way
    if (fullnameString === "Leanne") {
      result = fullnameString;
    }
    student.firstName =
      result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

    // STUDENTS LASTNAME

    let trimmedString2 = "";
    let result2 = "";
    //trim the end of fullname property string, so no spaces after last letter
    trimmedString2 = fullnameString.trimEnd();

    //make substring starting from last read space +1
    result2 = trimmedString2.substring(trimmedString2.lastIndexOf(" ") + 1);
    student.lastName =
      result2.charAt(0).toUpperCase() + result2.slice(1).toLowerCase();
    //if trimmedString only has fullname 'Leanne'
    if (trimmedString2 === "Leanne") {
      student.lastName = result2;
    }
    //if lastname has - in it
    else if (student.lastName.includes("-")) {
      student.lastName =
        //start by getting first part before -
        result2.substring(0, result2.lastIndexOf("-") + 1) +
        //then get first char after - and ONLY THE FIRST CHAR, make capital
        result2
          .substring(result2.lastIndexOf("-") + 1, result2.lastIndexOf("-") + 2)
          .toUpperCase() +
        //get rest of lastname in lowercase
        result2.substring(result2.lastIndexOf("-") + 2).toLowerCase();
    }

    // STUDENT MIDDLENAME

    let midName = "";
    let trimmedString3 = "";
    let result3 = "";
    //trim the fullname
    trimmedString3 = fullnameString.trim();
    //get trimmed fullname string and start new string by first space, end before last space
    //trim afterwards
    result3 = trimmedString3
      .substring(trimmedString3.indexOf(" "), trimmedString3.lastIndexOf(" "))
      .trim();

    midName = result3;

    //make first char uppercae and rest lowercase
    student.middleName =
      midName.charAt(0).toUpperCase() + midName.slice(1).toLowerCase();

    //if middleName results in an empty string, or has "" set property to null
    if (student.middleName.includes(`"`) || student.middleName === "") {
      student.middleName = "null";
    }

    let result4 = fullnameString.substring(
      fullnameString.indexOf(`"`),
      fullnameString.lastIndexOf(`"`) + 1
    );
    student.nickName = result4.replaceAll(`"`, ``);

    //capitalize house names!
    let houseName = jsonObject.house;
    houseName = houseName.trimStart();
    houseName = houseName.trimEnd();

    student.house =
      houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase();

    //images to display for each student
    let image = new Image(100, 100);

    // read imagefile name based on their lastname in lower case to match
    let imageFile = student.lastName.toLowerCase();

    //if image src has match with this pattern: lastname_firstLetter.png
    //using regex would be better...
    image.src = `images/${imageFile}_${student.firstName
      .charAt(0)
      .toLowerCase()}.png`;

    student.image = image.src;

    //check for unusual patterns.
    if (student.image.match("leanne")) {
      student.image = "undefined";
    } else if (student.image.includes("-")) {
      //if student has hyphen in lastname, start from char after hyphen. but with same pattern
      imageFile = student.lastName
        .substring(student.lastName.indexOf("-") + 1)
        .toLowerCase();
      image.src = `images/${imageFile}_${student.firstName
        .charAt(0)
        .toLowerCase()}.png`;
      student.image = image.src;
    } else if (student.image.includes("patil")) {
      //if student has name patil, then read entire firstname and match on pattern to find file.
      //future stuff: find a way to check if you can read if one student has same lastname as another

      imageFile = student.lastName.substring(0).toLowerCase();
      image.src = `images/${imageFile}_${student.firstName
        .substring(0)
        .toLowerCase()}.png`;
      student.image = image.src;
    }
    //set prefect status test
    student.prefect = false;
    student.gender = jsonObject.gender;

    allStudents.push(student);
  });
  //loading new properties (bloodstatus) in the allStudents array.
  setBloodStatus(getBloodStatus());

  return allStudents.student;
}

//SET BLOODSTATUS TO EACH STUDENT BASED ON BLOODSTATUSLIST
function setBloodStatus(bloodstatus) {
  allStudents.forEach((s) => {
    s.isHalf =
      bloodstatus.half.includes(s.lastName) ||
      (bloodstatus.pure.includes(s.lastName) &&
        bloodstatus.half.includes(s.lastName));
    s.isPure =
      bloodstatus.pure.includes(s.lastName) &&
      !bloodstatus.half.includes(s.lastName);
    s.isMuggle =
      !bloodstatus.half.includes(s.lastName) &&
      !bloodstatus.pure.includes(s.lastName);
  });

  return allStudents;
}

//
//DISPLAY STUDENTS
function displayList(list) {
  displayStudentList(list);
}

//TODO: DISPLAY STUDENTS
function displayStudentList(list) {
  //styling the list view - hide all the 'banner housecrest' lists - not pretily removed :)
  document.querySelector("#GhouseCrest").classList.add("hide");
  document.querySelector("#ShouseCrest").classList.add("hide");
  document.querySelector("#HhouseCrest").classList.add("hide");
  document.querySelector("#RhouseCrest").classList.add("hide");
  document.querySelector("#ListDisplay").classList.remove("hide");

  document.querySelector(".main_list").classList.add("studentList");

  //var stored of the filtered array List
  let StudentListToDisplay = list;

  //get h2 house name to get display
  let listToDisplay = document.querySelector("#ListDisplay");
  let listOverview = document.querySelector(".ListOverview");
  //get house banner
  const banner = listOverview.querySelector("#houseBanner");

  // get list name from filtervalue and make sure that #ListDisplay keeps div and headline and p tag before template tag's students get inserted
  if (filterActive.value === "Gryffindor") {
    banner.src = "picture_materials/Gryf_houseBanner.svg";
  } else if (filterActive.value === "Slytherin") {
    banner.src = "picture_materials/Slyt_houseBanner.svg";
  } else if (filterActive.value === "Hufflepuff") {
    banner.src = "picture_materials/Huff_houseBanner.svg";
  } else if (filterActive.value === "Ravenclaw") {
    banner.src = "picture_materials/Rave_houseBanner.svg";
  } else if (filterActive.value === "Prefects") {
    banner.src = "picture_materials/prefectBanner.svg";
  } else if (filterActive.value === "Inquisitor Squad") {
    banner.src = "picture_materials/squadBanner.svg";
  } else if (filterActive.value === "Expelled") {
    banner.src = "picture_materials/expelledBanner.svg";
  } else {
    document.querySelector("#GhouseCrest").classList.remove("hide");
    document.querySelector("#ShouseCrest").classList.remove("hide");
    document.querySelector("#HhouseCrest").classList.remove("hide");
    document.querySelector("#RhouseCrest").classList.remove("hide");
    document.querySelector(".main_list").classList.remove("studentList");
  }
  //clear listToDisplay container each time it studentListToDisplay gets run w/ filter (and or sort.)
  listToDisplay.innerHTML = ``;

  StudentListToDisplay.forEach((studentListed) => {
    //each student in the listDisplay Node
    let studentListClone = template.content.cloneNode(true);
    //set name to each student Node
    const nameDisplay = studentListClone.querySelector("p");
    const bloodStatusImgDisplay = studentListClone.querySelector(
      `.bloodStatusImgDisplay`
    );
    const prefectIconImgDisplay = studentListClone.querySelector(
      ".prefectIconImgDisplay"
    );
    //bad workaround for only one name
    if (studentListed.firstName === "Leanne") {
      nameDisplay.textContent = `${studentListed.firstName}` + ` -`;
    }
    //if they have a nickname instead of middlename
    else if (
      studentListed.middleName === "null" &&
      studentListed.nickName !== ""
    ) {
      nameDisplay.textContent = `${studentListed.firstName} "${studentListed.nickName}" ${studentListed.lastName}`;
    }
    //if they don't have a middleName
    else if (studentListed.middleName === "null") {
      nameDisplay.textContent = `${studentListed.firstName} ${studentListed.lastName} `;
    }

    //if they have a middleName
    else {
      nameDisplay.textContent = `${studentListed.firstName} ${studentListed.middleName} ${studentListed.lastName}`;
    }

    if (studentListed.isHalf) {
      bloodStatusImgDisplay.src = `picture_materials/halfBlood_icon.svg`;
    } else if (studentListed.isPure) {
      bloodStatusImgDisplay.src = `picture_materials/pureBlood_icon.svg`;
    } else {
      bloodStatusImgDisplay.src = `picture_materials/muggle_icon.svg`;
    }

    if (filterActive.value === "Prefects") {
      bloodStatusImgDisplay.src = ``;
      if (studentListed.house === "Gryffindor") {
        prefectIconImgDisplay.src = `picture_materials/Gryffindor_emblem.svg`;
        // houseEmblem.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.house === "Slytherin") {
        prefectIconImgDisplay.src = `picture_materials/Slytherin_emblem.svg`;
      } else if (studentListed.house === "Hufflepuff") {
        prefectIconImgDisplay.src = `picture_materials/Hufflepuff_emblem.svg`;
      } else {
        prefectIconImgDisplay.src = `picture_materials/Ravenclaw_emblem.svg`;
      }
    }

    //DEATILS POPOP WITH CLOSEPOPOP that removes eventlisteners when closing the popop
    function detailsPopop() {
      const detailsList = document.querySelector(".details");
      const detailImg = detailsList.querySelector("img");
      const houseEmblem = detailsList.querySelector(".houseEmblem");
      const bloodIcon = detailsList.querySelector(".bloodStatusImg");
      //details about the student data is loaded here
      detailsList.style.display = "grid";

      //theming the detailstList
      if (studentListed.house === "Gryffindor") {
        detailsList.style.backgroundColor = "var(--gryfRed)";
      }
      if (studentListed.house === "Slytherin") {
        detailsList.style.backgroundColor = "var(--slytGreen)";
      }
      if (studentListed.house === "Hufflepuff") {
        detailsList.style.backgroundColor = "var(--huffYellow)";
      }
      if (studentListed.house === "Ravenclaw") {
        detailsList.style.backgroundColor = "var(--raveBlue)";
      }
      //LOAD IMAGES IN DETAILS
      // //images to display for each student

      //  read imagefile name based on their lastname in lower case to match
      let imageFile = studentListed.lastName.toLowerCase();
      detailImg.src = `images/${imageFile}_${studentListed.firstName
        .charAt(0)
        .toLowerCase()}.png`;
      //if lastnames are identical, this case 'patil'
      if (imageFile.includes("patil")) {
        detailImg.src = `images/${imageFile}_${studentListed.firstName}.png`;
      } else if (imageFile.includes("-")) {
        //if student has hyphen in lastname, start from char after hyphen. but with same pattern
        imageFile = studentListed.lastName
          .substring(studentListed.lastName.indexOf("-") + 1)
          .toLowerCase();

        detailImg.src = `images/${imageFile}_${studentListed.firstName
          .charAt(0)
          .toLowerCase()}.png`;
      } else if (imageFile.includes("leanne")) {
        detailImg.src = "";
        detailImg.alt = "Not Available";
      }
      //HOUSE EMBLEM
      if (studentListed.house === "Gryffindor") {
        houseEmblem.src = `picture_materials/Gryffindor_emblem.svg`;
        // houseEmblem.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.house === "Slytherin") {
        houseEmblem.src = `picture_materials/Slytherin_emblem.svg`;
      } else if (studentListed.house === "Hufflepuff") {
        houseEmblem.src = `picture_materials/Hufflepuff_emblem.svg`;
      } else {
        houseEmblem.src = `picture_materials/Ravenclaw_emblem.svg`;
      }
      //NAME OF STUDENT
      detailsList.querySelector(".name").textContent = nameDisplay.textContent;

      //BLOODSTATUS - icons!
      detailsList.querySelector(".bloodtype").textContent = `BloodStatus: `;
      if (studentListed.isHalf) {
        bloodIcon.src = `picture_materials/halfBlood_icon.svg`;
        // bloodIcon.src = "picture_materials/halfBlood_icon.svg";
      } else if (studentListed.isPure) {
        bloodIcon.src = `picture_materials/pureBlood_icon.svg`;
      } else {
        bloodIcon.src = `picture_materials/muggle_icon.svg`;
      }
      //TOGGLE PREFECTS make activity diagram
      detailsList.querySelector(".isPrefect").textContent = "Prefect: ";
      detailsList
        .querySelector(".makePrefect")
        .addEventListener("click", makeStudentPrefect);

      //callback func
      function makeStudentPrefect() {
        clickPrefect(studentListed);
      }

      if (studentListed.prefect) {
        if (studentListed.house === "Gryffindor") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Gryf_prefect.svg`;
        }
        if (studentListed.house === "Slytherin") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Slyt_prefect.svg`;
        }
        if (studentListed.house === "Hufflepuff") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Huff_prefect.svg`;
        }
        if (studentListed.house === "Ravenclaw") {
          detailsList.querySelector(
            ".prefectIcon"
          ).src = `picture_materials/Rave_prefect.svg`;
        }
      } else {
        detailsList.querySelector(".prefectIcon").src = ``;
      }
      // TOGGLE INQUISITORIAL SQUAD:
      detailsList.querySelector(".isSquad").textContent =
        "Inquisitorial Squad: ";
      document.querySelector(".makeSquad").textContent = "Make Member";

      if (studentListed.isSquadMember) {
        document.querySelector(
          ".squadIcon"
        ).src = `picture_materials/Squad_icon.svg`;
        document.querySelector(".makeSquad").classList.add("hide");
        document.querySelector(".removeSquad").classList.remove("hide");
        document.querySelector(".removeSquad").style.cursor = "pointer";
        document.querySelector(".removeSquad").style.filter = "grayscale(0)";
        // this eventlistener removes a student that is alreay a inq. squad member
        detailsList
          .querySelector(".removeSquad")
          .addEventListener("click", removecallBackRemoveSMember);
      } else {
        document.querySelector(".makeSquad").classList.remove("hide");
        document.querySelector(".removeSquad").classList.add("hide");
        detailsList.querySelector(".isSquad").textContent += "";
        // detailsList.querySelector("#squadM").textContent = "";
        document.querySelector(".squadIcon").src = ``;
        // this eventlistener removes a callback() adding a student to inq.squad
        detailsList
          .querySelector(".makeSquad")
          .addEventListener("click", removecallbackAddSquadMember);
      }
      //callback func
      function removecallbackAddSquadMember() {
        clickSquadMember(studentListed);
        detailsList
          .querySelector(".makeSquad")
          .removeEventListener("click", removecallbackAddSquadMember);
      }
      function removecallBackRemoveSMember() {
        removeSquadMember(studentListed); //actually sets isSquadMember = false and removes object from list
        //remove the listener
        detailsList
          .querySelector(".removeSquad")
          .removeEventListener("click", removecallBackRemoveSMember);
      }
      //EXPEL STUDENTS
      detailsList.querySelector("#isExpelled").textContent = "";
      detailsList.style.filter = "none";
      detailsList.querySelector(".expellingStudent").classList.remove("hide");

      if (studentListed.expelled) {
        detailsList.style.filter = "grayscale(100%)";

        detailsList.querySelector("#isExpelled").textContent = "Expelled";
        detailsList.querySelector(".expellingStudent").classList.add("hide");
      } else {
        detailsList
          .querySelector(".expellingStudent")
          .addEventListener("click", removeCallbackExpellaStudent);
      }
      function removeCallbackExpellaStudent() {
        expelAStudent(studentListed);
        detailsList
          .querySelector(".expellingStudent")
          .removeEventListener("click", removeCallbackExpellaStudent);
      }

      //CLOSE DETAILS
      detailsList.querySelector("#close").addEventListener("click", closePopop);

      function closePopop() {
        //remove all eventlisteners on buttons when closing a details popop
        detailsList
          .querySelector(".makePrefect")
          .removeEventListener("click", makeStudentPrefect);
        detailsList
          .querySelector(".makeSquad")
          .removeEventListener("click", removecallbackAddSquadMember);
        detailsList
          .querySelector(".expellingStudent")
          .removeEventListener("click", removeCallbackExpellaStudent);

        detailsList
          .querySelector("#close")
          .removeEventListener("click", closePopop);
        detailsList.style.display = "none";
      }

      //when filter gets changes also close the details popop
      filterActive.addEventListener(
        "change",
        () => (detailsList.style.display = "none")
      );

      document.querySelector(".main_list").appendChild(detailsList);
    }
    nameDisplay.addEventListener("click", detailsPopop);

    //append the student name to the listDisplay Container
    listToDisplay.appendChild(studentListClone);
  });

  //interface display of information about the lists
  document.querySelector(
    ".info_list"
  ).textContent = ` Total of Students: ${allStudents.length},`;
  if (
    filterActive.value === "Gryffindor" ||
    filterActive.value === "Slytherin" ||
    filterActive.value === "Hufflepuff" ||
    filterActive.value === "Ravenclaw"
  ) {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in House: ${StudentListToDisplay.length}`;
  } else if (filterActive.value === "Prefects") {
    document.querySelector(
      ".info_list"
    ).textContent += ` Students in List: ${StudentListToDisplay.length}`;
  } else if (filterActive.value === "Expelled") {
    document.querySelector(
      ".info_list"
    ).textContent = ` Total of Students Expelled: ${expelledArray.length}`;
  } else {
    document.querySelector(
      ".info_list"
    ).textContent = ` Total of Students: ${StudentListToDisplay.length}, Number in list: ${squadArray.length}`;
  }
  //append template student list to display in main_list container.
  return document.querySelector(".main_list").appendChild(listOverview);
}

//EXPELLING A STUDENT
function expelAStudent(studentListed) {
  //this statement is only true when system is hacked
  if (studentListed.firstName === "Ting" && studentListed.lastName === "Lin") {
    document.querySelector(".expelMeNot").classList.remove("hide");

    document.querySelector("#Confirm").onclick = function (event) {
      if (event.target == document.querySelector("#Confirm")) {
        document.querySelector(".expelMeNot").classList.add("hide");
      }
    };
    studentListed.expelled = false;
    return;
  }
  if (!studentListed.expelled) {
    studentListed.prefect = false;
    studentListed.isSquadMember = false;
    squadArray.pop(studentListed);
    studentListed.expelled = true;
    document.querySelector(".details").style.filter = "grayscale(100%)"; //make details list grayed out as feedback
    expelledArray.push(studentListed); //moved into expelled list

    if (studentListed.house === "Gryffindor") {
      gryfPrefectArray.pop(studentListed);
    }
    if (studentListed.house === "Slytherin") {
      slytPrefectArray.pop(studentListed);
    }
    if (studentListed.house === "Hufflepuff") {
      huffPrefectArray.pop(studentListed);
    }
    if (studentListed.house === "Ravenclaw") {
      ravePrefectArray.pop(studentListed);
    }

    // filter all students to be expelled out from allStudents array so that student doesn't show up in list with !students.expelled
    allStudents = allStudents.filter(
      (student) =>
        student.firstName !== studentListed.firstName &&
        student.lastName !== studentListed.lastName
    );
    if (filterActive.value === "Inquisitor Squad") {
      squadArray = squadArray.filter(
        (student) =>
          student.firstName !== studentListed.firstName &&
          student.lastName !== studentListed.lastName
      );
      displayList(getFilterSortSearchValues());
      return;
    }
    displayList(getFilterSortSearchValues());
  }
}
//ADDING OR REMOVING PREFECTS IN PREFECT ARRAY, BAD IMPLEMENTATION OF THIS FEATURE
function clickPrefect(studentListed) {
  if (studentListed.house === "Gryffindor") {
    if (!studentListed.prefect && gryfPrefectArray.length === 2) {
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${gryfPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${gryfPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          gryfremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          gryfremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
    } else if (!studentListed.prefect && gryfPrefectArray.length < 2) {
      studentListed.prefect = true;
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      document.querySelector(".removePrefect").classList.add("hide");
      gryftogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Slytherin") {
    if (!studentListed.prefect && slytPrefectArray.length === 2) {
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${slytPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${slytPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          slytremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          slytremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
    } else if (!studentListed.prefect && slytPrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      slyttogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Hufflepuff") {
    if (!studentListed.prefect && huffPrefectArray.length === 2) {
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${huffPrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${huffPrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          huffremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          huffremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
    } else if (!studentListed.prefect && huffPrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      hufftogglePrefect(studentListed);
    }
  }
  if (studentListed.house === "Ravenclaw") {
    if (!studentListed.prefect && ravePrefectArray.length === 2) {
      document.querySelector(".removePrefect").classList.remove("hide");
      document.querySelector(
        "#removePrefectA"
      ).textContent = `Replace Prefect: ${ravePrefectArray[0].firstName} with ${studentListed.firstName}?`;
      document.querySelector(
        "#removePrefectB"
      ).textContent = `Replace Prefect: ${ravePrefectArray[1].firstName} with ${studentListed.firstName}?`;
      document
        .querySelector("#removePrefectA")
        .addEventListener("click", () => {
          raveremovePrefectA(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
      document
        .querySelector("#removePrefectB")
        .addEventListener("click", () => {
          raveremovePrefectB(studentListed);
          document.querySelector(".removePrefect").classList.add("hide");
        });
    } else if (!studentListed.prefect && ravePrefectArray.length < 2) {
      studentListed.prefect = true;
      document.querySelector(".removePrefect").classList.add("hide");
      // detailsList.querySelector(".isPrefect").textContent += "Yes";
      ravetogglePrefect(studentListed);
    }
  }
}

//GRYFFINDOR PREFECTS FUNCTIONS ADD AND REMOVE - bad implementation
function gryfremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== gryfPrefectArray[0].firstName) {
    gryfPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;

    gryfPrefectArray.shift(studentPrefect);
    gryfPrefectArray.unshift(studentPrefect);
  }

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;
}

function gryfremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== gryfPrefectArray[1].firstName) {
    gryfPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    gryfPrefectArray.shift(studentPrefect);
    gryfPrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;
}

function gryftogglePrefect(studentPrefect) {
  gryfPrefectArray.unshift(studentPrefect);
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Gryf_prefect.svg`;
}
//SLYTHERIN PREFECTS FUNCTIONS ADD AND REMOVE - bad implementation

function slytremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== slytPrefectArray[0].firstName) {
    slytPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    slytPrefectArray.shift(studentPrefect);
    slytPrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;
}
function slytremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== slytPrefectArray[1].firstName) {
    slytPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    slytPrefectArray.shift(studentPrefect);
    slytPrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;
}

function slyttogglePrefect(studentPrefect) {
  slytPrefectArray.unshift(studentPrefect);
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Slyt_prefect.svg`;
}

//HUFFLEPUFF PREFECT ADD AND REMOVE - bad implementation
function huffremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== huffPrefectArray[0].firstName) {
    huffPrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;

    huffPrefectArray.shift(studentPrefect);
    huffPrefectArray.unshift(studentPrefect);
  }

  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;
}
function huffremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== huffPrefectArray[1].firstName) {
    huffPrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    huffPrefectArray.shift(studentPrefect);
    huffPrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;
}

function hufftogglePrefect(studentPrefect) {
  huffPrefectArray.unshift(studentPrefect);
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Huff_prefect.svg`;
}
//RAVENCLAW PREFECT ADD AND REMOVE - bad implementation
function raveremovePrefectA(studentPrefect) {
  if (studentPrefect.firstName !== ravePrefectArray[0].firstName) {
    ravePrefectArray[0].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    ravePrefectArray.shift(studentPrefect);
    ravePrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;
}

function raveremovePrefectB(studentPrefect) {
  if (studentPrefect.firstName !== ravePrefectArray[1].firstName) {
    ravePrefectArray[1].prefect = false; // set element prefect 1 to be bool false, in order to replace [0] with newly added student.Prefect
    studentPrefect.prefect = true;
    ravePrefectArray.shift(studentPrefect);
    ravePrefectArray.unshift(studentPrefect);
  }
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;
}

function ravetogglePrefect(studentPrefect) {
  ravePrefectArray.unshift(studentPrefect);
  document.querySelector(
    ".prefectIcon"
  ).src = `picture_materials/Rave_prefect.svg`;
}

//INQ SQUAD
function clickSquadMember(studentListed) {
  if (
    (studentListed.house === "Slytherin" && !studentListed.expelled) ||
    (studentListed.isPure && !studentListed.expelled)
  ) {
    document.querySelector(".notSquadMember").classList.add("hide");
    studentListed.isSquadMember = true;
    squadArray.unshift(studentListed);
    document.querySelector(
      ".squadIcon"
    ).src = `picture_materials/Squad_icon.svg`;

    document.querySelector(".makeSquad").classList.add("hide");
    document.querySelector(".removeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").style.cursor = "default";
    document.querySelector(".removeSquad").style.filter = "grayscale(1)";

    if (flag) {
      //call the removeSquadMemeber function to remove the  squad member after 2s
      setTimeout(() => removeSquadMember(studentListed), 2000);
    }
  } else {
    document.querySelector(".squadIcon").src = ``;
    document.querySelector(".makeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").classList.add("hide");
    document.querySelector(".notSquadMember").classList.remove("hide");
    document
      .querySelector(".notSquadMember button")
      .addEventListener("click", () => {
        document.querySelector(".notSquadMember").classList.add("hide");
      });
  }
}
function removeSquadMember(studentListed) {
  if (
    studentListed.isSquadMember &&
    filterActive.value === "Inquisitor Squad"
  ) {
    studentListed.isSquadMember = false;
    squadArray.shift(studentListed);
    squadArray = squadArray.filter(
      (studentNoMember) =>
        studentNoMember.firstName !== studentListed.firstName &&
        studentNoMember.lastName !== studentListed.lastName
    );
    document.querySelector(".details").classList.add("hide"); //hides the popop when removing a student
    document.querySelector(".squadIcon").src = ``;
    //style so that when buttons change according to next button functionality,
    //remove -> make if clicked
    document.querySelector(".makeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").classList.add("hide");

    displayList(getFilterSortSearchValues());
  }
  if (
    studentListed.isSquadMember &&
    filterActive.value !== "Inquisitor Squad"
  ) {
    studentListed.isSquadMember = false;
    squadArray.shift(studentListed);
    document.querySelector(".squadIcon").src = ``;
    //style so that when buttons change according to next button functionality,
    //remove -> make if clicked
    document.querySelector(".makeSquad").classList.remove("hide");
    document.querySelector(".removeSquad").classList.add("hide");

    document.querySelector(".notify").classList.add("hide");
  }

  document.querySelector(".notify").classList.remove("hide");
  document.querySelector(
    ".notify p"
  ).textContent = `${studentListed.firstName} ${studentListed.lastName} is no longer a member of the Inquisitor Squad`;
  document.querySelector("#ConfirmMessage").onclick = function (event) {
    if (event.target == document.querySelector("#ConfirmMessage")) {
      document.querySelector(".notify").classList.add("hide");
    }
  };
}
let hackInput = ""; // var to keep count of hacked keystroke
//add listener on keydown on document.
document.addEventListener("keydown", function (evt) {
  hackInput += evt.key.toLowerCase(); // when a key is pressed, that is the event (evt), add that key to string of input (all lowercase)
  //check if input matches/endsWith desired secret hacking word
  if (hackInput.endsWith("hack")) {
    hackTheSystem();
    hackInput = "";
  }
});

//HACKING FUNCTION

function hackTheSystem() {
  if (flag) {
    //this flag condition prevents the system from scrambling the data more than once.
    return;
  }
  flag = true;
  //create me as an object w/ Student properties.
  const meObject = {
    firstName: "Ting",
    lastName: "Lin",
    middleName: "Hua",
    gender: "girl",
    house: "Slytherin",
    prefect: false,
    isSquadMember: false,
    expelled: false,
  };
  //inject myself into allStudents list.
  allStudents.push(meObject);

  //change blood status
  allStudents.forEach((student) => {
    if (student.isPure) {
      generateBloodStatusRandom(student);
    }
    //set former half and muggle blood to be pure blood
    else if (student.isHalf || student.isMuggle) {
      student.isPure = true;
      student.isHalf = false;
      student.isMuggle = false;
    }
  });

  function generateBloodStatusRandom(student) {
    const changeBloodStatusPure = Math.floor(Math.random() * 3);
    if (changeBloodStatusPure === 0) {
      /*set all three possible bloodstatus to be either true or false, based on number generated
      if student's former status is pure */
      student.isPure = true;
      student.isHalf = false;
      student.isMuggle = false;
    } else if (changeBloodStatusPure === 1) {
      student.isPure = false;
      student.isHalf = true;
      student.isMuggle = false;
    } else {
      student.isPure = false;
      student.isHalf = false;
      student.isMuggle = true;
    }
  }
}
