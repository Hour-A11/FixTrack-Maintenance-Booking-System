// جلب العناصر من الصفحة
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");

// 1. القائمة البيضاء: الإيميل الوحيد المصرح له كمسؤول (تعديل الإيميل الجديد)
const AUTHORIZED_ADMINS = [
    "hoor75455@gmail.com"
];

// دالة لعرض رسالة للمستخدم
function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `message ${type}`;
}

// دالة لفحص وجود جلسة حالية
async function checkSession() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        if (data.session) {
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        console.error("خطأ في فحص الجلسة:", error.message);
    }
}

checkSession();

// --- التعامل مع تسجيل الدخول ---
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            showAuthMessage("فشل تسجيل الدخول: " + error.message, "error");
            return;
        }

        showAuthMessage("تم تسجيل الدخول بنجاح، جارٍ التحويل...", "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    });
}

// --- التعامل مع إنشاء حساب جديد (نظام حماية الصلاحيات المحدث) ---
if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const selectedRole = document.getElementById("signupRole").value;

        // 2. التحقق من الصلاحية: (حماية بريدك الجديد)
        let finalRole = "client"; 
        if (selectedRole === "admin") {
            if (AUTHORIZED_ADMINS.includes(email.toLowerCase())) {
                finalRole = "admin";
            } else {
                alert("تنبيه أمني: هذا البريد غير مصرح له بصلاحيات المسؤول. سيتم تسجيلك كعميل فقط.");
                finalRole = "client";
            }
        }

        // 3. إنشاء الحساب في نظام المصادقة (Auth)
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            showAuthMessage("فشل إنشاء الحساب: " + error.message, "error");
            return;
        }

        // 4. حفظ البيانات في جدول profiles مع الرتبة المعتمدة
        if (data.user) {
            const { error: profileError } = await supabaseClient
                .from("profiles")
                .insert([
                    {
                        id: data.user.id,
                        full_name: fullName,
                        role: finalRole, 
                        phone: phone
                    }
                ]);

            if (profileError) {
                console.error("خطأ في حفظ الملف الشخصي:", profileError.message);
                showAuthMessage("تم إنشاء الحساب، ولكن فشل حفظ بيانات الملف الشخصي.", "error");
            } else {
                showAuthMessage("تم إنشاء الحساب بنجاح كـ (" + (finalRole === 'admin' ? 'مسؤول' : 'عميل') + ")", "success");
                signupForm.reset();
            }
        }
    });
}