public with sharing class LWCRest {
    @AuraEnabled
    public static List<creditor> LWCRestMethod(){
        HttpRequest httpRequest = new HttpRequest();  
        httpRequest.setEndpoint('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json');
        httpRequest.setMethod('GET');
        String strResponse = null;
        try {  
          Http http = new Http();   
                HttpResponse httpResponse = http.send(httpRequest);  
                if (httpResponse.getStatusCode() == 200 ) {  
                    strResponse = httpResponse.getBody();  
                    system.debug('strResponse ' + strResponse);
                } 
                else {  
                    throw new CalloutException(httpResponse.getBody());  
                } 
             
            } 
            catch(Exception ex) {  
                throw ex;  
            } 
         if(!String.isBlank(strResponse)) {
                return (List<creditor>)JSON.deserialize(strResponse,List<creditor>.class);
            }else{
                return null;
            }
    }
    
    public class creditor{
        @AuraEnabled
        public string id;
        @AuraEnabled
        public string creditorName;
        @AuraEnabled
        public string firstName;
        @AuraEnabled
        public string lastName;
        @AuraEnabled
        public decimal minPaymentPercentage;
        @AuraEnabled        
		public decimal balance;
    }
}