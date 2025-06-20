<template>
  <div class="about-container">
    <!-- Banner -->
    <div class="banner">
      <img
        src="../../assets/img/hotel-presidente-4s.jpg"
        alt="JW Marriott Hanoi"
        class="banner-image"
      />
    </div>

    <!-- Section 1: Title & Summary -->
    <div class="section">
      <div class="text-block">
        <h4>Hanoi Xin Chào!</h4>
        <h2>Khu Nghỉ Dưỡng Yên Bình Trong Lòng Thành Phố</h2>
        <p>
          Bền không gian ven hồ thoáng mát, Hanoi sở hữu
          450 phòng nghi sang trọng và rộng rãi (từ 48 sq.m) cùng các
          tiện ích cá nhân hóa nhằm mang tới những trải nghiệm 
          dịu thuý và thoải mái cho du khách.
        </p>
      </div>
    </div>

    <!-- Section 2: Text and Image Side by Side -->
    <div class="section section-alt">
      <div class="text-block">
        <h4>Hanoi Xin Chào!</h4>
        <h2>Dưỡng Yên Bình ở Thành Phố</h2>
        <p>
         Hanoi là điểm đến không thể bỏ qua với các tiện ích âm
          thực đặc sắc và khu vực giải trí tuyệt vời. Khách sạn đáp 
          ứng mọi nhu cầu từ nghi đến thư giãn và nghi ngơi, mang lại
          một không gian đặc quyền ngay trong trung tâm.
        </p>
      </div>
      <div class="image-block">
        <img
          src="../../assets/img/hotel-presidente-4s.jpg"
          alt="Gia đình vui vẻ"
        />
      </div>
    </div>

    <!-- Section 3: Lợi ích -->
    <div class="benefits">
      <h3>Lợi ích khi đặt phòng trực tiếp với chúng tôi</h3>
      <div class="benefit-list">
        <div class="benefit-item"> 💲 Đảm bảo giá tốt nhất </div>
        <div class="benefit-item"> 🌟 Hỗ trợ khách hàng 24/7 </div>
        <div class="benefit-item"> 🌐 Truy cập Internet miễn phí </div>
        <div class="benefit-item"> ✅ Thay đổi và hủy dễ dàng </div>
        <div class="benefit-item"> 🎁 Khách thực đánh giá thực </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed yet
</script>

<style scoped>
.about-container {
  font-family: Arial, sans-serif;
  color: #333;
}
.banner-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 500px;
}
.section {
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;
}
.section-alt {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}
.text-block {
  max-width: 600px;
  padding: 1rem;
}
.image-block img {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
}
.benefits {
  padding: 3rem 2rem;
  background: #f8f8f8;
  text-align: center;
}
.benefit-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}
.benefit-item {
  background: white;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 200px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
</style>
