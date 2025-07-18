<template>
  <div class="about-container">
    <!-- Banner -->
    <div class="banner">
      <img
        src="../../assets/img/a.jpeg"
        alt="JW Marriott Hanoi"
        class="banner-image"
      />
    </div>

 <!-- Section 1: Title & Summary -->
<div class="section section-alt">
  <div class="text-block">
    <h4>ChiThanhHotel Xin Chào!</h4>
    <h2>Khu Nghỉ Dưỡng Yên Bình</h2>
    <p>
      Bên không gian ven hồ thoáng mát, ChiThanhHotel sở hữu
      100+ phòng nghỉ sang trọng và rộng rãi cùng các
      tiện ích cá nhân hóa nhằm mang tới những trải nghiệm 
      dịu thuý và thoải mái cho du khách.
    </p>
  </div>
  <div class="image-block">
    <img src="../../assets/img/a1.jpg" alt="Ảnh khách sạn 1" />
  </div>
</div>

<!-- Section 2: Text and Image Side by Side -->
<div class="section section-alt">
  <div class="text-block">
    <h2>Như Bạn Đang Ở Nhà</h2>
    <p>
      ChiThanhHotel là điểm đến không thể bỏ qua với các tiện ích ẩm
      thực đặc sắc và khu vực giải trí tuyệt vời. Khách sạn đáp 
      ứng mọi nhu cầu từ nghỉ đến thư giãn và nghỉ ngơi, mang lại
      một không gian thoải mái như là nhà bạn.
    </p>
  </div>
  <div class="image-block">
    <img src="../../assets/img/a2.jpg" alt="Ảnh khách sạn 2" />
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
   <!-- Footer -->
<footer class="bg-light text-center text-muted mt-5 py-4 border-top">
  <div class="container">
    <!-- <hr class="mb-3" style="width: 60px; border-top: 3px solid #444;" /> -->

    <h5 class="fw-bold mb-2">ChiThanhHotel</h5>
    <p class="mb-1">Số 46 Phạm Ngọc Thạch , Trung Tự , Đống Đa ,Hà Nội , Điện thoại</p>

    <div class="d-flex flex-wrap justify-content-center gap-3">
      <span>Điện thoại: <strong>+84 965540033</strong></span>
      <span>• Fax: <strong>+84 965540033</strong></span>
      <span>• Email: <a href="mailto:mhres.hanjw.reservation@marriott.com">chithanh1622003@gmail.com</a></span>
    </div>

    <div class="mt-3">
  <a href="#" class="me-3 text-dark fs-4"><i class="fab fa-facebook-f"></i></a>
  <a href="#" class="me-3 text-dark fs-4"><i class="fab fa-instagram"></i></a>
  <a href="/lien-he" class="text-dark fs-4"><i class="bi bi-envelope"></i></a>
</div>

  </div>
</footer>
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

.section,
.section-alt {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 3rem 2rem;
  gap: 2rem;
}

.text-block,
.image-block {
  flex: 1;
  max-width: 50%;
}

.text-block {
  padding: 1rem;
  text-align: left;
}

.image-block img {
  width: 60%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Benefits section */
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
