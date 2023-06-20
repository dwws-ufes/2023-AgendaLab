from injector import inject

class EmailService:
    def send_email(self, destination, subject, body):
        print("========= Email Sent =========")
        print(f"To: {destination}")
        print(f"Subject: {subject}")
        print(body)
        print("==================================")

# Notification service that can be injected into the models and have EmailService injected into it
class NotificationService:
    @inject
    def __init__(self, email_service: EmailService = EmailService()):
        self.email_service = email_service

    def notify(self, message):
        print("=== Notification ===")
        print(message)
        print("====================")
    
    def send_email(self, destination, subject, body):
        self.email_service.send_email(destination, subject, body)

class CodeGenerationService:

    # ================= Public Methods ================= #

    def generate_6_digit_code(self):
        from random import randint
        code = randint(100000, 999999)
        return code

    # Generate a unique code based on the department code and the number of laboratories
    def generate_unique_code(self, options, *args):
        if options == 'Laboratory':
            return self._generate_laboratory_unique_code(args[0])
        elif options == 'Scheduling':
            return self._generate_scheduling_unique_code()
        else:
            raise ValueError("Invalid options")

    # ================= Private Methods ================= #

    # Generate a unique code based on the department code and the number of laboratories
    def _generate_laboratory_unique_code(self, created_by): #Private Method
        from .models import Laboratory, Department
        code = created_by.code
        number = len(Laboratory.objects.filter(created_by=created_by))
        code += str(number)
        while Laboratory.objects.filter(code=code).exists():
            number += 1
            code = created_by.code + str(number)
        return code
    # Generate a unique scheduling code based on the number of existing scheduling
    def _generate_scheduling_unique_code(self):
        from .models import Scheduling
        number = len(Scheduling.objects.all())
        while Scheduling.objects.filter(code=number).exists():
            number += 1
        return number

    # =================================================== #

class Services:
    @inject
    def __init__(self,
                    notification_service: NotificationService = NotificationService(),
                    code_generation_service: CodeGenerationService = CodeGenerationService()
                 ):
        self.notification_service = notification_service
        self.code_generation_service = code_generation_service
    
    def send_email(self, destination, subject, body):
        self.notification_service.send_email(destination, subject, body)

    def notify(self, message):
        self.notification_service.notify(message)

    def generate_unique_code(self, options, *args):
        return self.code_generation_service.generate_unique_code(options, *args)

    def generate_6_digit_code(self):
        return self.code_generation_service.generate_6_digit_code()

serviceHandler = Services()
