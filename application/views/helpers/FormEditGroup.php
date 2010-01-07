<?php

/**
 * classe experimental para se utilizar com forms que possuem displaygroups
 * @author abner
 *
 */

class Zend_View_Helper_FormEditGroup
{

    public $view;

    public function setView(Zend_View_Interface $view)
    {
        $this->view = $view;
        return $this;
    }

    public function FormEditGroup(Zend_Form $form, $baseUrl = false, array $elements)
    {

        $output = '
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
<br/><br/>
<form name="'.$form->getName().'" id="'.$form->getId().'" action="'. $baseUrl . $form->getAction().'" method="'.$form->getMethod().'">
';
        for ($i=0; $i < count($elements); $i++)
        {
//            $_el = $form->getElement($elements[$i]);
            $_el = null;
            if ($form->getElement($elements[$i]) != null) {
                $_el = $form->getElement($elements[$i]);
            } else {
                $_el = $form->getDisplayGroup($elements[$i]);
            }
            if (!$_el) {
                throw new Exception("Element (".$elements[$i].") not found in Zend_Form object");
            }
            if ($_el instanceof Zend_Form_Element_Hidden) {
                $output .= $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');;
                continue;
            }
        }
        unset($i);
        $output .= '
<table
	id="form"
	align="center"
	border="0"
	cellpadding="0"
	cellspacing="0"
	bgcolor="#F7F6F4"
	class="content"
	style="	border-right: 1px solid #CCCCCC;
			border-bottom: 1px solid #CCCCCC;
			border-left: 1px solid #919191;
			font-size: 12px;">

  <tr
    style="background: url(\''.$baseUrl.'/images/grid/bg_title.gif\');">
    <td width="20" ></td>
    <td colspan="5" height="20" width="480" style="font-size: 11px;"><b>'.str_replace('_', ' ', strtoupper($form->getName())).'</b></td>
  </tr>

  <tr>
    <td height="2" bgcolor="#f36400" colspan="5"/>
  </tr>

';
        $_displayLast     = false;
        $_displayCurrent  = false;
        $_displayElements = false;
        for ($i=0; $i < count($elements); $i++)
        {
            $_el = $form->getElement($elements[$i]);
            $_display = $form->getDisplayGroup($elements[$i]);

            if ($_display) {
                $_displayElements = $_display->getElements();

                $output .= '
  <tr>
    <td height="10" colspan="5"> </td>
  </tr>
  <tr>
    <td width="20"></td>
    <td align="left" colspan="4">
      <fieldset style="width: 90%">
        <legend>'. $_display->getAttrib('legend') .'</legend>
<table
	align="center"
	border="0"
	cellpadding="0"
	cellspacing="0"
	bgcolor="#F7F6F4"
	class="content"
	style="font-size: 12px;">';


                foreach ($_displayElements as $_displayElement) {
                	$_input = $_displayElement->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');
                    $output .= '
  <tr>
    <td height="10" colspan="3"> </td>
  </tr>
  <tr>
    <td class="label">'. $_displayElement->getLabel() .'</td>
    <td width="10"></td>
    <td class="element">'. $_input .'</td>
  </tr>
                ';

                }

                $output .= '
</table>
                </fieldset>
    </td>
  </tr>
';















                continue;
            }

            if (is_int($elementCity = strpos($_el->getName(), 'cidades_id'))) {

                if (is_int($elementCity)) {
                    $_input  = $form->getElement(substr($_el->getName(),0,$elementCity).'uf')->removeDecorator('tag')->removeDecorator('label');
                } else {
                    $_input  = $form->getElement('uf')->removeDecorator('tag')->removeDecorator('label');
                }

                $_input .= " - ";
                $_input .= $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');
            } else {
                $_input = $_el->removeDecorator('tag')->removeDecorator('label')->removeFilter('StringTrim');
            }
            $groups = $form->getDisplayGroups();
        
            $output .='
  <tr>
    <td height="10" colspan="5"> </td>
  </tr>
  <tr>
    <td width="20"></td>
    <td class="label">'.$_el->getLabel().':</td>
    <td width="10"></td>
    <td class="element">'.$_input.'</td>
    <td width="50"></td>
  </tr>
';
        }

        $output .= '

  <tr>
    <td height="10" colspan="5"/>
  </tr>

  <tr>
    <td width="20"></td>
    <td align="center">'.$form->submit.'</td>
    <td width="10"></td>
    <td align="center">'.$form->getElement('cancel')->setAttrib('onclick', "location.href = '".$baseUrl."/".Zend_Controller_Front::getInstance()->getRequest()->getControllerName()."'; return false;").'</td>
    <td width="50"></td>
  </tr>

  <tr>
    <td height="10" colspan="5"/>
  </tr>

</table>
</form>
';
        return $output;
    }

}