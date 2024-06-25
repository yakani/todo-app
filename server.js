

const listcontainer = document.querySelector('[data-list]');
const newlist = document.querySelector('[data-new]');
const deletelist=document.querySelector('[data-delete-list]');
const name_list=document.querySelector('[data-name-list]');
const count_list_idem=document.querySelector('[data-count-list]');
const display_list=document.querySelector('[data-container]');
const task_list=document.querySelector('[data-task]');
const delete_task=document.querySelector('[data-delete-tasks]');
const tasktemplate=document.getElementById('task-template');
const taskform=document.querySelector('[data-insert-task]');
let newlistinput = document.querySelector('[data-newinput]');
let newtaskinput=document.querySelector('[data-task-value]');
const LOCAL_STORAGE_KEY = 'yakani.lists';
const LOCAL_ID_KEY = 'yakani.lists.id';
let test;
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
let selectedId = localStorage.getItem(LOCAL_ID_KEY);
listcontainer.addEventListener('click', (e)=> {

    if (e.target.tagName.toLowerCase() == 'li') {
        selectedId = e.target.innerText;
        saveandrender();
    }
    
});
delete_task.addEventListener('click',()=>{
    const selectelist=lists.find(list=>list.name==selectedId);
    selectelist.text=selectelist.text.filter(task=>!task.complete);
    saveandrender();
})
task_list.addEventListener('click',e=>{
    if (e.target.tagName.toLowerCase() == 'input') {
      const selectelist=lists.find(list=>list.name==selectedId);
      
      const selectedtask=selectelist.text.find(task=>task.name==e.target.id);
      selectedtask.complete=e.target.checked;
      save();
      render_tasks(selectelist);
    }
})
deletelist.addEventListener('click',(e)=>{
lists=lists.filter((list)=>list.name!=selectedId);
selectedId=null;
saveandrender();
})
const render = () => {
    console.log(listcontainer);
    clearelement(listcontainer);
    if(lists==null){
        display_list.style.display="none";
    }
    render_list();
    if(selectedId==null){
        display_list.style.display="none";
    }else{
        const slectelist=lists.find((list)=>list.name==selectedId);
        display_list.style.display="";
        name_list.innerText=selectedId;
        render_tasks(slectelist);
        clearelement(task_list);
        render_task_list(slectelist);
    }
}
function render_task_list(params) {
    params.text.forEach((task)=>{
        const taskelement=document.importNode(tasktemplate.content,true);
        const checkbox=taskelement.querySelector('input');
        checkbox.id=task.name;
        checkbox.checked=task.complete;
        const label=taskelement.querySelector('label');
        label.htmlFor=task.name;
        label.append(task.name);
        task_list.appendChild(taskelement);
    })
}
function render_tasks(params) {
    const incompletetasks=params.text.filter((task)=>!task.complete).length;
    const takestring=incompletetasks<2 ? ' task ' : ' tasks ';
    count_list_idem.innerText=incompletetasks+takestring+"remaining";
}
function render_list() {
    lists.forEach(elt => {
        const listelement = document.createElement('li');
        listelement.className = "list-name";
        listelement.dataset.listId = elt.id;
        listelement.innerText = elt.name;
        if (elt.name == selectedId) {
            //console.log(elt.id);
            listelement.classList.add("active-list");
        }

        listcontainer.appendChild(listelement);
    });
}
newlist.addEventListener('submit', e => {
    e.preventDefault();
    if (newlistinput.value != '') {
lists.push(createlist(newlistinput.value));
    newlistinput.value = null;
    saveandrender();
    }
    
});
taskform.addEventListener('submit',e=>{
    e.preventDefault();
    console.log(newtaskinput.value);
    if (newtaskinput.value!='') {
       const task= createTask(newtaskinput.value);
       newtaskinput.value=null;
       (lists.find(list=>list.name==selectedId)).text.push(task);
       saveandrender();
    }
    
})
function saveandrender() {
    save();
    render();
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_ID_KEY, selectedId);
}
function createTask(params) {
    return {id:Date.now.toString(),name:params,complete:false};
}
const clearelement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
const createlist = (element) => {
    let x;
    if (lists.length == 0) {
        x = 0;
    } else { x = lists.length + 1 }
    return { id: Date.now.toString(), position: x, name: element, text: [] };
}
render();