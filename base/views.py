from django.shortcuts import render
from .Regybox_API import RegyBox_API
from .password_handling import encrypt_password, decrypt_password
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from rest_framework import status , permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from .models import User, Classes_to_enroll_model
from decouple import config

def serve_react_app(request):
    # Serve your React app's index.html file
    return render(request, 'index.html')  # Assuming 'index.html' is your React entry point

class LoginView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request, format='json'):
        email = request.data["email"]
        password = request.data["password"]
        SECRET_KEY = config('SECRET_KEY')
        regybox_api = RegyBox_API()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None
        if user is None:
            cookie_regybox = regybox_api.login(148, email, password)
            if cookie_regybox is None:
                return Response(
                    {
                        "success": False,
                        "message": ["Invalid Login Credentials!"],
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                hashed_password = encrypt_password(password, SECRET_KEY)
                user = User.objects.create(email=email , password=hashed_password)
                user.save()
                access_token = AccessToken.for_user(user)
                refresh_token =RefreshToken.for_user(user)
                regybox_token = cookie_regybox
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),
                     "regybox_token": str(regybox_token)},
                    status=status.HTTP_200_OK,
                )
            

        if password != decrypt_password(user.password, SECRET_KEY):
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Login Credentials!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if user is not None:
            cookie_regybox = regybox_api.login(148, email, password)
            if cookie_regybox is None:
                return Response(
                    {
                        "success": False,
                        "message": ["Invalid Login Credentials!"],
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            else:
                access_token = AccessToken.for_user(user)
                refresh_token =RefreshToken.for_user(user)
                regybox_token = cookie_regybox
                return Response(
                    {"success": True, 
                     "message": ["You are now logged in!"],
                     "refresh_token": str(refresh_token),
                     "access_token": str(access_token),
                     "regybox_token": str(regybox_token)},
                    status=status.HTTP_200_OK,
                )


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Get the refresh token from the cookie
        refresh_token = request.data['refresh_token']


        if refresh_token is None:
            return Response({"detail": "Refresh token not found in cookies"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare the data for the token refresh (pass the refresh token to the serializer)
        request.data['refresh'] = refresh_token
        
        # Continue with the normal refresh process
        new_refresh_token = super().post(request, *args, **kwargs)

        return new_refresh_token
                

class ProtectedDataView(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        # Aqui você pode acessar request.user para obter o usuário autenticado
        regybox_token = request.query_params.get("regybox_token")
        if regybox_token is None:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Token!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(status=status.HTTP_200_OK)
    

class GetClassesForTheDay(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        date = request.query_params.get("date")
        regybox_token = request.query_params.get("regybox_token")
        regybox_api = RegyBox_API()
        [requested_date, classes_of_the_day] = regybox_api.get_classes_for_the_day(date , cookie=regybox_token)

        # Performs the necessary checks to ensure the validity of the request
        if requested_date is None:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Token!"],
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        if requested_date != date:
            return Response(
                {
                    "success": False,
                    "message": ["Invalid Date!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if len(classes_of_the_day) == 0:
            return Response(
                {
                    "success": False,
                    "message": ["No classes available for the day!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user  # Obtém o usuário autenticado
        
        # Acessa as classes para as quais o usuário está inscrito
        classes = user.classes_to_enroll.all()  # Isso retorna um QuerySet de Classes_to_enroll_model

        # Se quiser formatar a resposta:
        classes_list = [{'date': cls.date, 'hour': cls.hour} for cls in classes]
        enrolled_for_the_day = False
        for class_of_the_day in classes_of_the_day:
            for cls in classes_list:
                if date == cls["date"] and class_of_the_day["time"] == cls["hour"]:
                    class_of_the_day["enrolled"] = True
                    enrolled_for_the_day = True
                    break
            else:
                class_of_the_day["enrolled"] = False

        if enrolled_for_the_day:
            for class_of_the_day in classes_of_the_day:
                class_of_the_day['enrolled_for_the_day'] = True
                class_of_the_day['date'] = date # Adiciona a data à resposta para colocar nos botões
        else:
            for class_of_the_day in classes_of_the_day:
                class_of_the_day['enrolled_for_the_day'] = False
                class_of_the_day['date'] = date
        
        return Response(classes_of_the_day, status=status.HTTP_200_OK)
    


class AddClassToScheduler(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def post(self, request):
        date = request.data["date"]
        time = request.data["time"]
        try:
            user = User.objects.get(email=request.user)
        except User.DoesNotExist:
            user = None        
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": ["User not found!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if user.classes_to_enroll.filter(date=date, hour=time).exists():
            return Response(
                {
                    "success": False,
                    "message": ["Class already added to scheduler!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crie uma nova instância do modelo de classe
        class_to_add = Classes_to_enroll_model.objects.create(date=date, hour=time)

        # Adicione a nova classe ao usuário
        user.classes_to_enroll.add(class_to_add)

        user.save()

        return Response(
            {
                "success": True,
                "message": ["Class added to scheduler!"],
            },
            status=status.HTTP_200_OK,
        )
    
class RemoveClassFromScheduler(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def post(self, request):
        date = request.data["date"]
        time = request.data["time"]
        try:
            user = User.objects.get(email=request.user)
        except User.DoesNotExist:
            user = None        
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": ["User not found!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Obtenha a classe a ser removida
        class_to_remove = Classes_to_enroll_model.objects.all().filter(date=date, hour=time)

        for class_2_remove in class_to_remove:
        # Remova a classe do usuário
            user.classes_to_enroll.remove(class_2_remove)

        user.save()

        return Response(
            {
                "success": True,
                "message": ["Class removed from scheduler!"],
            },
            status=status.HTTP_200_OK,
        )
    
class RemoveClassFromRegybox(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def post(self, request):
        date = request.data["date"]
        time = request.data["time"]
        try:
            user = User.objects.get(email=request.user)
        except User.DoesNotExist:
            user = None        
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": ["User not found!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        regybox_api = RegyBox_API()
        regybox_token = request.query_params.get("regybox_token")

        # Obtenha a classe a ser removida
        classes_of_the_day = regybox_api.get_classes_for_the_day(date, cookie=regybox_token)
        found_class = False

        for class_2_remove in classes_of_the_day:
            if class_2_remove["time"] == time:
                id_aula = class_2_remove["class_id"]
                regybox_api.remove_class(date, id_aula, regybox_token)
                found_class = True
                break
        
        if not found_class:
            return Response(
                {
                    "success": False,
                    "message": ["Class not found in Regybox!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "success": True,
                "message": ["Class removed from scheduler!"],
            },
            status=status.HTTP_200_OK,
        )
    
class GetAlreadyEnrolledClasses(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        try:
            user = User.objects.get(email=request.user)
        except User.DoesNotExist:
            user = None        
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": ["User not found!"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Acessa as classes para as quais o usuário está inscrito
        regybox_api = RegyBox_API()
        regybox_token = request.query_params.get("regybox_token")

        enrolled_classes = regybox_api.get_enrolled_classes(regybox_token)

        # Acessa as classes para as quais o usuário ainda não está inscrito
        classes_2_enroll = user.classes_to_enroll.all()  # Isso retorna um QuerySet de Classes_to_enroll_model

        # Se quiser formatar a resposta:
        classes_list_to_enroll = [{'date': cls.date, 'hour': cls.hour} for cls in classes_2_enroll]

        response_form = {
            "success": True,
            "enrolled_classes": enrolled_classes,
            "classes_list_to_enroll": classes_list_to_enroll
        }
        
        return Response(response_form, status=status.HTTP_200_OK)