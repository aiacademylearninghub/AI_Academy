import os
import firebase_admin
from firebase_admin import credentials, firestore, auth,storage
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'firebase-service-account.json'))

# Your default Firebase Storage bucket name.
STORAGE_BUCKET = 'aimoney-828cc.firebasestorage.app'
FIRESTORE_DATABASE_ID = 'db-aimoney'

try:
        cred = credentials.Certificate(json_path)
        firebase_app = firebase_admin.initialize_app(cred, {
            'storageBucket': FIRESTORE_DATABASE_ID# This sets the default bucket for storage operations
        })
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    exit()

def get_firebase_app():
     # --- Initialize the Firebase Admin SDK ---
    return cred


def get_firestore_client():
    try:
        db = firestore.client(database_id=FIRESTORE_DATABASE_ID)
    except Exception as e:
        print(f"Error connecting to Firestore or performing operations: {e}")
    return db

def get_storage_bucket():
    try :
        bucket = storage.bucket()
    except Exception as e:
        print(f"Error connecting to Storage or performing operations: {e}")
    return bucket

# TODO: read and write to firestore instead of local file system
def store_user_financial_data(user_id:str,data:dict)->None:
    db = get_firestore_client()
    for tool_name,result in data.items():
        if not result:
            EMPTY_DATA_FOLDER = os.path.join(BASE_DIR, 'mock_data', 'fi_mcp_tool_results_empty')
            with open(os.path.join(EMPTY_DATA_FOLDER, tool_name+'.json'), 'r') as file:
                result = json.load(file)
        if tool_name == 'fetch_net_worth':
            db.collection('net_worth').document(user_id).set(result)
        elif tool_name == 'fetch_stock_transactions':
            result_json = json.dumps(result)
            result_value = {'txns':result_json}
            db.collection('stock_transactions').document(user_id).set(result_value)
        elif tool_name == 'fetch_mf_transactions':
            result_json = json.dumps(result)
            result_value = {'txns':result_json}
            db.collection('mf_transactions').document(user_id).set(result_value)
        elif tool_name == 'fetch_credit_report':
            db.collection('credit_report').document(user_id).set(result)
        elif tool_name == 'fetch_epf_details':
            db.collection('epf_details').document(user_id).set(result)
        elif tool_name == 'fetch_bank_transactions':
            result_json = json.dumps(result)
            result_value = {'txns':result_json}
            db.collection('bank_transactions').document(user_id).set(result_value)


def load_family_info(user_id:str)->dict:
    try:
        db = get_firestore_client()
        family_data = db.collection("family").document(user_id).get()
        members = family_data.to_dict().get("members",[])
        members_info = []
        for member_info in members:
            if not member_info or type(member_info)!=dict:
                continue
            members_info.append((member_info["email"].rstrip("@gmail.com"),member_info["uid"]))
        return members_info
    except Exception as e:
        print("Error getting family info",e)
        return []

def load_user_financial_data(user_id:str)->dict:
    direct_reads = ['net_worth','credit_report','epf_details']
    json_reads = ['bank_transactions','mf_transactions',"stock_transactions"]
    data = {}
    db = get_firestore_client()
    for element in direct_reads:
        data[element] = db.collection(element).document(user_id).get().to_dict()
    for element in json_reads:
        transactions = db.collection(element).document(user_id).get().to_dict()
        if not transactions:
            continue
        data[element] = json.loads(transactions['txns'])
    return data


def load_user_financial_data_dummy(user_id:str)->dict:
    direct_reads = ['net_worth','credit_report','epf_details']
    direct_read_elements = ['fetch_'+ele for ele in direct_reads]
    json_reads = ['bank_transactions','mf_transactions','stock_transactions']
    json_reads_elements = ['fetch_'+ele for ele in json_reads]
    data = {}
    db = get_firestore_client()
    for name,element in zip(direct_read_elements,direct_reads):
        data[name] = db.collection(element).document(user_id).get().to_dict()
    for name,element in zip(json_reads_elements,json_reads):
        data[name] = json.loads(db.collection(element).document(user_id).get().to_dict()['txns'])
    return data


if __name__=="__main__":
    with open("temp.json","w") as f:
        json.dump(load_user_financial_data("6eXizgvwbZN3SddUIZOL1FzO1ok2"),f)
