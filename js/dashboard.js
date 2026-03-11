const welcomeText = document.getElementById("welcomeText");
const bookingList = document.getElementById("bookingList");
const bookingModal = document.getElementById("bookingModal");
const openModalBtn = document.getElementById("openModalBtn");
const newBookingForm = document.getElementById("newBookingForm");

openModalBtn.onclick = () => bookingModal.style.display = "block";

async function requireAuth() {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) { window.location.href = "auth.html"; return null; }
    return data.session.user;
}

// تحديث الحالة مع إشعار SweetAlert2
async function updateStatus(id, status) {
    try {
        const { error } = await supabaseClient.from('bookings').update({ status }).eq('id', id);
        if (error) throw error;

        // إشعار نجاح عصري
        Swal.fire({
            icon: 'success',
            title: 'تمت العملية',
            text: 'تم تحديث حالة الطلب بنجاح.',
            confirmButtonColor: '#0ea5e9',
            timer: 2000
        });

        loadDashboard();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: err.message });
    }
}

async function loadDashboard() {
    const user = await requireAuth();
    if (!user) return;

    const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", user.id).single();
    const isAdmin = profile?.role === 'admin';

    if (isAdmin) { openModalBtn.style.display = "none"; }

    welcomeText.innerHTML = `مرحباً، <strong>${profile?.full_name}</strong> (${isAdmin ? 'مسؤول النظام' : 'عميل'})`;

    try {
        let query = supabaseClient.from('bookings').select('*');
        if (!isAdmin) query = query.eq('user_id', user.id);

        const { data: bookings, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        document.getElementById("totalBookings").textContent = bookings.length;
        document.getElementById("pendingBookings").textContent = bookings.filter(b => b.status === 'pending').length;
        document.getElementById("progressBookings").textContent = bookings.filter(b => b.status === 'in_progress').length;
        document.getElementById("completedBookings").textContent = bookings.filter(b => b.status === 'completed').length;

        bookingList.innerHTML = bookings.map(b => `
            <div class="booking-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong style="color: var(--primary);">#${b.id}</strong>
                        <p style="margin: 8px 0; font-weight: 500;">${b.details}</p>
                        <small style="color: var(--gray);"><i class="fas fa-map-marker-alt"></i> ${b.location || 'غير محدد'}</small>
                    </div>
                    <span class="status-tag">${b.status === 'pending' ? 'قيد المراجعة' : b.status === 'in_progress' ? 'جاري التنفيذ' : 'مكتمل'}</span>
                </div>
                
                ${isAdmin && b.status !== 'completed' ? `
                <div class="admin-controls">
                    <button onclick="updateStatus(${b.id}, 'in_progress')" class="btn btn-secondary" style="padding: 5px 12px; font-size:0.75rem;">جاري التنفيذ</button>
                    <button onclick="updateStatus(${b.id}, 'completed')" class="btn btn-primary" style="padding: 5px 12px; font-size:0.75rem;">اعتماده كمكتمل</button>
                </div>` : ''}
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

newBookingForm.onsubmit = async (e) => {
    e.preventDefault();
    const user = await requireAuth();
    const details = document.getElementById("bookingDetails").value.trim();
    const location = document.getElementById("bookingLocation").value.trim();

    const { error } = await supabaseClient.from('bookings').insert([{ user_id: user.id, details, location, status: 'pending' }]);
    if (!error) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'تم الإرسال بنجاح', showConfirmButton: false, timer: 3000 });
        bookingModal.style.display = "none";
        newBookingForm.reset();
        loadDashboard();
    }
};

document.getElementById("logoutBtn").onclick = async () => { await supabaseClient.auth.signOut(); window.location.href = "auth.html"; };
document.addEventListener("DOMContentLoaded", loadDashboard);