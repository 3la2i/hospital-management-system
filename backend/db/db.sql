CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Admin, Doctor , Patient
    social_login_id VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Doctor Contact Table
CREATE TABLE DoctorDetails (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES Users(id) ON DELETE CASCADE,
    hospital_name TEXT,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    image TEXT,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Doctor Availability Table
CREATE TABLE DoctorAvailability (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES Users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_booked BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE (doctor_id, date, time_slot)
);



CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Users(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES Users(id) ON DELETE CASCADE,
    availability_id INT REFERENCES DoctorAvailability(id) ON DELETE CASCADE, 
    status BOOLEAN DEFAULT FALSE,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE (patient_id, doctor_id, availability_id)
);



-- -- Appointments Table
-- CREATE TABLE Appointments (
--     id SERIAL PRIMARY KEY,
--     patient_id INT REFERENCES Users(id) ON DELETE CASCADE,
--     doctor_id INT REFERENCES Users(id) ON DELETE CASCADE,
--     date DATE NOT NULL,
--     time_slot VARCHAR(50) NOT NULL,
--     status VARCHAR(50) DEFAULT 'pending',
--     notes TEXT,
--     is_deleted BOOLEAN DEFAULT FALSE,
--     UNIQUE (patient_id, doctor_id, date, time_slot)
-- );

-- Patient Medical Records
CREATE TABLE PatientMedicalRecords (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Users(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES Users(id) ON DELETE SET NULL,
    doctor_details INT REFERENCES DoctorDetails(id) ON DELETE CASCADE,
    price INT,
    is_paid BOOLEAN DEFAULT FALSE,
    visit_date DATE NOT NULL,
    diagnosis TEXT,
    treatment_plan TEXT,
    medications TEXT,
    follow_up_date DATE,
    visit_notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Users(id) ON DELETE SET NULL,
    doctor_id INT REFERENCES Users(id) ON DELETE SET NULL,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback_type VARCHAR(50) NOT NULL,
    feedback_text TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Posts Table
CREATE TABLE DoctorPosts (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Reports Table
CREATE TABLE Reports (
    id SERIAL PRIMARY KEY,
    reported_by INT REFERENCES Users(id) ON DELETE CASCADE,
    reported_entity_type VARCHAR(50) NOT NULL,
    reported_entity_id INT NOT NULL,
    report_reason VARCHAR(255),
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    resolution_text TEXT,
    resolution_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    appointment_id INT REFERENCES Appointments(id)
);



CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES DoctorDetails(id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ContactUs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

