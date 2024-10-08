# 1. For build React app
FROM node:16-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://gwdu.ptit.edu.vn/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://gwdu.ptit.edu.vn/sso/realms/ptit
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=ptit-
ENV APP_CONFIG_APP_VERSION=241002.1430

ENV APP_CONFIG_CO_QUAN_CHU_QUAN='BỘ THÔNG TIN VÀ TRUYỀN THÔNG'
ENV APP_CONFIG_TEN_TRUONG='HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG'
ENV APP_CONFIG_TIEN_TO_TRUONG='Học viện'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH=PTIT
ENV APP_CONFIG_PRIMARY_COLOR=#CC0D00

ENV APP_CONFIG_URL_LANDING=https://ptit.edu.vn/
ENV APP_CONFIG_URL_CONNECT=https://slink.ptit.edu.vn/
ENV APP_CONFIG_URL_CAN_BO=https://canbo.ptit.edu.vn/
ENV APP_CONFIG_URL_DAO_TAO=https://daotao-ptit.vercel.app/
ENV APP_CONFIG_URL_NHAN_SU=https://nhansu-ptit.vercel.app/
ENV APP_CONFIG_URL_TAI_CHINH=https://thanhtoan.ptit.edu.vn/
ENV APP_CONFIG_URL_CTSV=https://ctsv.ptit.edu.vn/
ENV APP_CONFIG_URL_QLKH=
ENV APP_CONFIG_URL_VPS=https://vanphong.ptit.edu.vn/
ENV APP_CONFIG_URL_KHAO_THI=
ENV APP_CONFIG_URL_CORE=https://core-ptit.vercel.app/
ENV APP_CONFIG_URL_CSVC=
ENV APP_CONFIG_URL_THU_VIEN=
# https://thuvien-ptit.vercel.app/
ENV APP_CONFIG_URL_QLVB=

ENV APP_CONFIG_TITLE_LANDING='Cổng thông tin'
ENV APP_CONFIG_TITLE_CONNECT='Slink'
ENV APP_CONFIG_TITLE_CAN_BO='Cổng cán bộ'
ENV APP_CONFIG_TITLE_DAO_TAO='Quản lý đào tạo'
ENV APP_CONFIG_TITLE_NHAN_SU='Tổ chức nhân sự'
ENV APP_CONFIG_TITLE_TAI_CHINH='Thanh toán'
ENV APP_CONFIG_TITLE_CTSV='Công tác sinh viên'
ENV APP_CONFIG_TITLE_QLKH='Quản lý khoa học'
ENV APP_CONFIG_TITLE_VPS='Văn phòng số'
ENV APP_CONFIG_TITLE_KHAO_THI='Khảo thí'
ENV APP_CONFIG_TITLE_CORE='Danh mục chung'
ENV APP_CONFIG_TITLE_CSVC='Cơ sở vật chất'
ENV APP_CONFIG_TITLE_THU_VIEN='Thư viện'
ENV APP_CONFIG_TITLE_QLVB='Quản lý văn bản'


# Set working directory
WORKDIR /app

COPY package.json /app/
RUN yarn install

COPY . /app

FROM development AS build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website

RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
