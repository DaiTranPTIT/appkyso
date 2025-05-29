# 1. For build React app
FROM node:16-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://vinhuni-gw.ript.vn/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://vinhuni-sso.ript.vn/realms/vinhuni
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=vinhuni-
ENV APP_CONFIG_APP_VERSION=250416.0840

ENV APP_CONFIG_CO_QUAN_CHU_QUAN='Bộ Giáo dục và Đào tạo'
ENV APP_CONFIG_TEN_TRUONG='Trường Đại học Vinh'
ENV APP_CONFIG_TIEN_TO_TRUONG='Trường'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH=VINHUNI
ENV APP_CONFIG_PRIMARY_COLOR=#004998

ENV APP_CONFIG_URL_LANDING=https://vinhuni.edu.vn/
ENV APP_CONFIG_URL_CONNECT=https://vinhuni-sinhvien.ript.vn/
ENV APP_CONFIG_URL_CAN_BO=https://vinhuni-canbo.ript.vn/
ENV APP_CONFIG_URL_DAO_TAO=https://vinhuni-qldt.ript.vn/
ENV APP_CONFIG_URL_NHAN_SU=https://vinhuni-tcns.ript.vn/
ENV APP_CONFIG_URL_TAI_CHINH=https://vinhuni-taichinh.ript.vn/
ENV APP_CONFIG_URL_CTSV=https://vinhuni-ctsv.ript.vn/
ENV APP_CONFIG_URL_QLKH=https://vinhuni-qlkh.ript.vn/
ENV APP_CONFIG_URL_VPS=https://vinhuni-vps.ript.vn/
ENV APP_CONFIG_URL_KHAO_THI=https://vinhuni-khaothi.ript.vn/
ENV APP_CONFIG_URL_CORE=https://vinhuni-core.ript.vn/
ENV APP_CONFIG_URL_CSVC=https://vinhuni-csvc.ript.vn/
ENV APP_CONFIG_URL_THU_VIEN=
ENV APP_CONFIG_URL_QLVB=https://vinhuni-sso.ript.vn/realms/vinhuni/protocol/openid-connect/auth?response_type=code&client_id=vinhuni-qlvb&redirect_uri=http%3A%2F%2Fvinhuni-qlvb.ript.vn%2Fauth_oauth%2Fsignin&scope=openid+profile+email&state=%7B%22d%22%3A+%22qlvb%22%2C+%22p%22%3A+4%2C+%22r%22%3A+%22http%253A%252F%252Fvinhuni-qlvb.ript.vn%252Fweb%22%7D

ENV APP_CONFIG_TITLE_LANDING='Cổng thông tin'
ENV APP_CONFIG_TITLE_CONNECT='Cổng người học'
ENV APP_CONFIG_TITLE_CAN_BO='Cổng cán bộ'
ENV APP_CONFIG_TITLE_DAO_TAO='Quản lý đào tạo'
ENV APP_CONFIG_TITLE_NHAN_SU='Tổ chức nhân sự'
ENV APP_CONFIG_TITLE_TAI_CHINH='Tài chính'
ENV APP_CONFIG_TITLE_CTSV='Công tác sinh viên'
ENV APP_CONFIG_TITLE_QLKH='Quản lý khoa học'
ENV APP_CONFIG_TITLE_VPS='Văn phòng điều hành'
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
