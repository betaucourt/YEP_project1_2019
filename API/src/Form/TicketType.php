<?php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Entity\Ticket;
use App\Entity\User;
use App\Form\DataTransformer\TicketUserTransformer;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class TicketType extends AbstractType
{

    public function __construct(TicketUserTransformer $transformer) {
        $this->transformer = $transformer;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class, [])
                ->add('description', TextType::class, [])
                ->add('category', IntegerType::class, [])
                ->add('user', TextType::class, []);
        $builder->get('user')
                ->addModelTransformer($this->transformer);
    }

    Public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Ticket::class,
            'csrf_protection' => false,
        ));
    }
}