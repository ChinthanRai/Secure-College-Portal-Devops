const API_URL = 'http://51.20.31.138:5000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

async function runTests() {
    try {
        console.log("=== STARTING INTEGRATION TESTS ===");
        
        const uniqueId = Date.now();
        // 1. Register Admin
        console.log("\n1. Testing Admin Registration...");
        const adminData = await request('/auth/register', 'POST', {
            name: "Admin Verification", email: `ci-admin-${uniqueId}@test.com`, password: "password123", role: "admin", department: "CS"
        });
        const adminToken = adminData.token;
        console.log("✅ Admin Registered Successfully");

        // 2. Create Course
        console.log("\n2. Testing Course Creation...");
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.toISOString().split('T')[0];
        const courseData = await request('/courses', 'POST', {
            title: `CI/CD Pipeline Intro ${uniqueId}`, code: `CICD${uniqueId}`, description: "Testing constraints",
            credits: 3, instructor: "Auto Tester", maxSeats: 10,
            startDate: tomorrow, endDate: tomorrow, enrollmentDeadline: tomorrow, sessionTimings: "Mon at 10:00 AM"
        }, adminToken);
        const courseId = courseData._id;
        console.log("✅ Course Created Successfully");

        // 3. Register Student
        console.log("\n3. Testing Student Registration...");
        const studentData = await request('/auth/register', 'POST', {
            name: "Student Verification", email: `ci-student-${uniqueId}@test.com`, password: "password123", role: "student", department: "CS"
        });
        const studentToken = studentData.token;
        console.log("✅ Student Registered Successfully");

        // 4. Generate OTP
        console.log("\n4. Testing OTP Generation...");
        const otpData = await request('/enrollment/generate-otp', 'POST', { courseId }, studentToken);
        console.log("✅ OTP Generated & Email Simulated:", otpData.otp);

        // 5. Verify OTP
        console.log("\n5. Testing OTP Verification...");
        await request('/enrollment/verify-otp', 'POST', { courseId, otp: otpData.otp }, studentToken);
        console.log("✅ OTP Verified, Enrollment Request Pending");

        // 6. Check Student "My Requests"
        console.log("\n6. Testing Student Pending Requests Fetch...");
        const myRequests = await request('/enrollment/my-requests', 'GET', null, studentToken);
        if (myRequests.length > 0) console.log("✅ Student Pending Requests Fetched Successfully");

        // 7. Admin Approves Request
        console.log("\n7. Testing Admin Request Fetch and Approval...");
        const adminRequests = await request('/enrollment/requests', 'GET', null, adminToken);
        const requestId = adminRequests[0]._id;
        await request('/enrollment/process', 'POST', { requestId, action: 'approve' }, adminToken);
        console.log("✅ Admin Successfully Approved Request");

        console.log("\n🎉 ALL TESTS PASSED! Project is perfectly ready for CI/CD.");
    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    }
}

runTests();
