// استخراج دالة إنشاء عميل Supabase من المكتبة
const { createClient } = supabase;

// رابط المشروع (URL) تجدينه في إعدادات Supabase
const SUPABASE_URL = "https://ubqovsgyobcljgodiees.supabase.co";

// المفتاح العام (Anon Key) - يجب استبدال النص أدناه بالمفتاح الحقيقي
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicW92c2d5b2JjbGpnb2RpZWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTYxNTAsImV4cCI6MjA4ODgzMjE1MH0.sQh3dQk-K7Gl-xo0KYUpLZ6hK9901pYtlrNv_1jonEE";

// إنشاء العميل الذي سنستخدمه في auth.js و dashboard.js
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);