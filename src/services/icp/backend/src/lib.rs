
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update, storage};
use ic_cdk::api::time;
use std::cell::RefCell;
use std::collections::BTreeMap;

// Define the MedicalTest struct
#[derive(CandidType, Deserialize, Clone)]
pub struct MedicalTest {
    id: String,
    patient_id: String,
    doctor_id: String,
    name: String,
    date: String,
    result: Option<String>,
    status: String,
    recommendations: Option<String>,
    created_at: u64,
    updated_at: u64,
}

// Storage for our medical tests
thread_local! {
    static MEDICAL_TESTS: RefCell<BTreeMap<String, MedicalTest>> = RefCell::new(BTreeMap::new());
}

// Create a new medical test
#[update]
fn create_test(test: MedicalTest) -> String {
    let test_id = test.id.clone();
    
    MEDICAL_TESTS.with(|tests| {
        let mut tests_mut = tests.borrow_mut();
        tests_mut.insert(test_id.clone(), test);
    });
    
    test_id
}

// Get a specific test by ID
#[query]
fn get_test(id: String) -> Option<MedicalTest> {
    MEDICAL_TESTS.with(|tests| {
        tests.borrow().get(&id).cloned()
    })
}

// Update an existing test
#[update]
fn update_test(test: MedicalTest) -> bool {
    let test_id = test.id.clone();
    
    MEDICAL_TESTS.with(|tests| {
        let mut tests_mut = tests.borrow_mut();
        
        if tests_mut.contains_key(&test_id) {
            tests_mut.insert(test_id, test);
            true
        } else {
            false
        }
    })
}

// Delete a test by ID
#[update]
fn delete_test(id: String) -> bool {
    MEDICAL_TESTS.with(|tests| {
        let mut tests_mut = tests.borrow_mut();
        
        if tests_mut.contains_key(&id) {
            tests_mut.remove(&id);
            true
        } else {
            false
        }
    })
}

// Get all tests for a specific patient
#[query]
fn get_tests_by_patient(patient_id: String) -> Vec<MedicalTest> {
    MEDICAL_TESTS.with(|tests| {
        tests.borrow()
            .values()
            .filter(|test| test.patient_id == patient_id)
            .cloned()
            .collect()
    })
}

// Get all tests for a specific doctor
#[query]
fn get_tests_by_doctor(doctor_id: String) -> Vec<MedicalTest> {
    MEDICAL_TESTS.with(|tests| {
        tests.borrow()
            .values()
            .filter(|test| test.doctor_id == doctor_id)
            .cloned()
            .collect()
    })
}

// Get all tests with a specific status
#[query]
fn get_tests_by_status(status: String) -> Vec<MedicalTest> {
    MEDICAL_TESTS.with(|tests| {
        tests.borrow()
            .values()
            .filter(|test| test.status == status)
            .cloned()
            .collect()
    })
}

// Generate Candid interface
ic_cdk::export_candid!();
