import { LightningElement,api,wire,track } from 'lwc';
import fetchDataHelper from './fetchDataHelper.js';
import restdatapull from '@salesforce/apex/LWCRest.LWCRestMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const columns = [
    { label: 'Creditor', fieldName: 'creditorName', editable:true },
    { label: 'First Name', fieldName: 'firstName' , editable:true},
    { label: 'Last Name', fieldName: 'lastName' , editable:true},
    { label: 'Min Pay%', fieldName: 'minPaymentPercentage' , editable:true},
    { label: 'Balance', fieldName: 'balance' , editable:true, type: "currency" }
];

export default class DatatableWithRowActions extends LightningElement {
    data = [];
    columns = columns;
    total;
    selectedRows = [];
    saveDraftValues;
   

    connectedCallback() {
        restdatapull().then(result => {
                this.data = result;
                this.calculateBalanceTotal(this.data);
            }).catch(error => {
                console.log(error);
            });
    }

    get totalRowCount(){
        return this.data.length;
    }

    get selectedRowCount(){
        return this.selectedRows.length;
    }

    calculateBalanceTotal(dataArray){
        this.total = dataArray.map(element => element.balance).reduce((total, n) => total + n, 0);
    };

    onSelectRow(event) {    
            this.selectedRows = event.detail.selectedRows;
            if (this.selectedRows.length == 0) {
                this.calculateBalanceTotal(this.data);
            }else{
                this.calculateBalanceTotal(this.selectedRows); 
            } 
    }

    handleAddDebt(){
        const rowId = this.data.length + 1;
        this.data = [...this.data, {
                                    'creditorName':'',
                                    'firstName':'',
                                    'lastName':'',
                                    'minPaymentPercentage':0,
                                    'balance':0,
                                    'id': rowId
                                    }]
    }

    handleRemoveDebt(){
        if(this.selectedRows && this.selectedRows.length > 0){
            this.deleteRow();
        }else{
            this.showWarningToast(); 
        }
    }

    showWarningToast() {
        const evt = new ShowToastEvent({
            title: 'No rows selected for the selected action',
            message: '',
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    handleDraftValues(event){
        this.saveDraftValues = event.detail.draftValues;
        this.saveDraftValues.forEach(element=>{
            if(element.balance){
                this.data[element.id - 1].balance = parseInt(element.balance);
            }
        });
        if (this.selectedRows.length > 0) {
            this.calculateBalanceTotal(this.selectedRows);
        }else{
            this.calculateBalanceTotal(this.data);
        }      
    }

    deleteRow() {
        if(this.selectedRows){
            this.selectedRows.forEach(element=>{
                delete this.data[element.id-1]
            })
            let tempData = this.data;
            this.data = [];
            let id=1;
            tempData.forEach(element=>{
                if(element){
                    element.id = id;
                    id++;
                    this.data.push(element);
                }
            });
        }
        
    }
}